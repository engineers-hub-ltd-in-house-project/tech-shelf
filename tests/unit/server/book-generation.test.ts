import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BookGenerationService } from '$lib/server/book-generation';
import { prisma } from '$lib/server/database';
import puppeteer from 'puppeteer';
import EPub from 'epub-gen-memory';
import fs from 'fs/promises';

// Mock dependencies
vi.mock('$lib/server/database', () => ({
  prisma: {
    bookCreationProject: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('puppeteer');
vi.mock('epub-gen-memory');
vi.mock('fs/promises');
vi.mock('marked', () => ({
  marked: vi.fn((content) => `<p>${content}</p>`),
}));

describe('BookGenerationService', () => {
  const mockProject = {
    id: 'test-project-id',
    title: 'Test Book',
    description: 'Test Description',
    posts: [
      {
        blogPost: {
          id: 'post-1',
          title: 'Chapter 1',
          content: '# Chapter 1\n\nThis is chapter 1.',
        },
        chapter: { id: 'chapter-1', title: 'Part 1' },
        order: 0,
      },
      {
        blogPost: {
          id: 'post-2',
          title: 'Chapter 2',
          content: '# Chapter 2\n\nThis is chapter 2.',
        },
        chapter: null,
        order: 1,
      },
    ],
    chapters: [
      {
        id: 'chapter-1',
        title: 'Part 1',
        order: 0,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generatePDF', () => {
    it('should generate PDF successfully', async () => {
      // Mock Prisma
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject);
      vi.mocked(prisma.bookCreationProject.update).mockResolvedValue({} as any);

      // Mock Puppeteer
      const mockPage = {
        setContent: vi.fn(),
        pdf: vi.fn(),
      };
      const mockBrowser = {
        newPage: vi.fn().mockResolvedValue(mockPage),
        close: vi.fn(),
      };
      vi.mocked(puppeteer.launch).mockResolvedValue(mockBrowser as any);

      // Generate PDF
      const result = await BookGenerationService.generatePDF('test-project-id');

      // Assertions
      expect(result).toMatch(/^\/generated\/test-project-id-\d+\.pdf$/);
      expect(prisma.bookCreationProject.update).toHaveBeenCalledWith({
        where: { id: 'test-project-id' },
        data: {
          generationStatus: 'generating_pdf',
          generationError: null,
        },
      });
      expect(mockPage.setContent).toHaveBeenCalled();
      expect(mockPage.pdf).toHaveBeenCalledWith(
        expect.objectContaining({
          format: 'A4',
          printBackground: true,
        })
      );
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle PDF generation failure', async () => {
      // Mock Prisma
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject);
      vi.mocked(prisma.bookCreationProject.update).mockResolvedValue({} as any);

      // Mock Puppeteer to throw error
      vi.mocked(puppeteer.launch).mockRejectedValue(new Error('Puppeteer error'));

      // Generate PDF
      await expect(BookGenerationService.generatePDF('test-project-id')).rejects.toThrow(
        'Puppeteer error'
      );

      // Check error was saved
      expect(prisma.bookCreationProject.update).toHaveBeenLastCalledWith({
        where: { id: 'test-project-id' },
        data: {
          generationStatus: 'failed',
          generationError: 'Puppeteer error',
        },
      });
    });
  });

  describe('generateEPub', () => {
    it('should generate ePub successfully', async () => {
      // Mock Prisma
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject);
      vi.mocked(prisma.bookCreationProject.update).mockResolvedValue({} as any);

      // Mock EPub
      const mockEpub = {
        genEpub: vi.fn().mockResolvedValue(Buffer.from('epub content')),
      };
      vi.mocked(EPub).mockImplementation(() => mockEpub as any);

      // Generate ePub
      const result = await BookGenerationService.generateEPub('test-project-id');

      // Assertions
      expect(result).toMatch(/^\/generated\/test-project-id-\d+\.epub$/);
      expect(prisma.bookCreationProject.update).toHaveBeenCalledWith({
        where: { id: 'test-project-id' },
        data: {
          generationStatus: 'generating_epub',
          generationError: null,
        },
      });
      expect(mockEpub.genEpub).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle ePub generation failure', async () => {
      // Mock Prisma
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject);
      vi.mocked(prisma.bookCreationProject.update).mockResolvedValue({} as any);

      // Mock EPub to throw error
      vi.mocked(EPub).mockImplementation(() => {
        throw new Error('EPub error');
      });

      // Generate ePub
      await expect(BookGenerationService.generateEPub('test-project-id')).rejects.toThrow(
        'EPub error'
      );

      // Check error was saved
      expect(prisma.bookCreationProject.update).toHaveBeenLastCalledWith({
        where: { id: 'test-project-id' },
        data: {
          generationStatus: 'failed',
          generationError: 'EPub error',
        },
      });
    });
  });

  describe('error handling', () => {
    it('should throw error when project not found', async () => {
      // Mock Prisma to return null
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(null);

      // Generate PDF
      await expect(BookGenerationService.generatePDF('non-existent-id')).rejects.toThrow(
        'Project not found'
      );
    });
  });
});
