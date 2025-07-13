import { prisma } from '$lib/server/database';
import type { BookCreationProject, BlogPost, BookProjectChapter } from '@prisma/client';
import puppeteer from 'puppeteer';
import EPub from 'epub-gen-memory';
import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

type ProjectWithRelations = BookCreationProject & {
  posts: {
    blogPost: BlogPost;
    chapter: BookProjectChapter | null;
    order: number;
  }[];
  chapters: BookProjectChapter[];
};

export class BookGenerationService {
  private static GENERATED_DIR = 'static/generated';

  static async ensureGeneratedDir() {
    const dir = path.join(process.cwd(), this.GENERATED_DIR);
    await fs.mkdir(dir, { recursive: true });
  }

  static async generatePDF(projectId: string): Promise<string> {
    const project = await this.getProjectWithRelations(projectId);

    // Update generation status
    await prisma.bookCreationProject.update({
      where: { id: projectId },
      data: {
        generationStatus: 'generating_pdf',
        generationError: null,
      },
    });

    try {
      // Generate HTML content
      const html = await this.generateHTML(project);

      // Launch puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Generate PDF
      const filename = `${projectId}-${Date.now()}.pdf`;
      const filepath = path.join(process.cwd(), this.GENERATED_DIR, filename);

      await page.pdf({
        path: filepath,
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
        printBackground: true,
      });

      await browser.close();

      // Update project with PDF URL
      const pdfUrl = `/generated/${filename}`;
      await prisma.bookCreationProject.update({
        where: { id: projectId },
        data: {
          pdfUrl,
          generationStatus: 'completed',
          lastGeneratedAt: new Date(),
        },
      });

      return pdfUrl;
    } catch (error) {
      console.error('PDF generation failed:', error);
      await prisma.bookCreationProject.update({
        where: { id: projectId },
        data: {
          generationStatus: 'failed',
          generationError: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  static async generateEPub(projectId: string): Promise<string> {
    const project = await this.getProjectWithRelations(projectId);

    // Update generation status
    await prisma.bookCreationProject.update({
      where: { id: projectId },
      data: {
        generationStatus: 'generating_epub',
        generationError: null,
      },
    });

    try {
      // Prepare chapters for epub
      const chapters = await this.prepareEpubChapters(project);

      // Generate ePub
      const options = {
        title: project.title,
        author: 'Tech Shelf',
        publisher: 'Tech Shelf',
        content: chapters,
        css: await this.getEpubCSS(),
      };

      const epub = new (EPub as any)(options);
      const buffer = await epub.genEpub();

      // Save ePub file
      const filename = `${projectId}-${Date.now()}.epub`;
      const filepath = path.join(process.cwd(), this.GENERATED_DIR, filename);
      await fs.writeFile(filepath, buffer);

      // Update project with ePub URL
      const epubUrl = `/generated/${filename}`;
      await prisma.bookCreationProject.update({
        where: { id: projectId },
        data: {
          epubUrl,
          generationStatus: 'completed',
          lastGeneratedAt: new Date(),
        },
      });

      return epubUrl;
    } catch (error) {
      console.error('ePub generation failed:', error);
      await prisma.bookCreationProject.update({
        where: { id: projectId },
        data: {
          generationStatus: 'failed',
          generationError: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  private static async getProjectWithRelations(projectId: string): Promise<ProjectWithRelations> {
    const project = await prisma.bookCreationProject.findUnique({
      where: { id: projectId },
      include: {
        posts: {
          include: {
            blogPost: true,
            chapter: true,
          },
          orderBy: { order: 'asc' },
        },
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  private static async generateHTML(project: ProjectWithRelations): Promise<string> {
    const postsHTML = await Promise.all(
      project.posts.map(async (post) => {
        const htmlContent = await marked(post.blogPost.content);
        return `
          <div class="chapter">
            <h2>${post.blogPost.title}</h2>
            ${htmlContent}
          </div>
        `;
      })
    );

    return `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>${project.title}</title>
        <style>
          body {
            font-family: 'Noto Sans JP', sans-serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            font-size: 2.5em;
            text-align: center;
            margin-bottom: 2em;
            page-break-after: always;
          }
          h2 {
            font-size: 2em;
            margin-top: 2em;
            margin-bottom: 1em;
            page-break-after: avoid;
          }
          .chapter {
            page-break-before: always;
          }
          pre {
            background-color: #f5f5f5;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
          }
          code {
            background-color: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: monospace;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            margin-left: 0;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>${project.title}</h1>
        ${project.description ? `<p class="description">${project.description}</p>` : ''}
        ${postsHTML.join('\n')}
      </body>
      </html>
    `;
  }

  private static async prepareEpubChapters(project: ProjectWithRelations) {
    const chapters = [];

    // Group posts by chapter
    const chapterMap = new Map<string | null, typeof project.posts>();

    for (const post of project.posts) {
      const chapterId = post.chapter?.id || null;
      if (!chapterMap.has(chapterId)) {
        chapterMap.set(chapterId, []);
      }
      chapterMap.get(chapterId)!.push(post);
    }

    // Process chapters
    for (const chapter of project.chapters) {
      const posts = chapterMap.get(chapter.id) || [];
      if (posts.length === 0) continue;

      const content = await Promise.all(
        posts.map(async (post) => {
          const htmlContent = await marked(post.blogPost.content);
          return `
            <h2>${post.blogPost.title}</h2>
            ${htmlContent}
          `;
        })
      );

      chapters.push({
        title: chapter.title,
        data: content.join('\n'),
      });
    }

    // Add posts without chapters
    const postsWithoutChapter = chapterMap.get(null) || [];
    for (const post of postsWithoutChapter) {
      const htmlContent = await marked(post.blogPost.content);
      chapters.push({
        title: post.blogPost.title,
        data: htmlContent,
      });
    }

    return chapters;
  }

  private static async getEpubCSS(): Promise<string> {
    return `
      body {
        font-family: serif;
        line-height: 1.8;
      }
      h1, h2, h3, h4, h5, h6 {
        font-weight: bold;
        margin-top: 1em;
        margin-bottom: 0.5em;
      }
      p {
        margin: 1em 0;
        text-align: justify;
      }
      pre {
        background-color: #f5f5f5;
        padding: 1em;
        overflow-x: auto;
        font-family: monospace;
      }
      code {
        font-family: monospace;
        background-color: #f5f5f5;
        padding: 0.1em 0.3em;
      }
      blockquote {
        margin: 1em 2em;
        font-style: italic;
      }
      img {
        max-width: 100%;
        height: auto;
      }
    `;
  }
}
