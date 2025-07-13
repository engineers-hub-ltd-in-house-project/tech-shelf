import { requireAuth } from '$lib/server/auth-helper';
import { BookGenerationService } from '$lib/server/book-generation';
import { prisma } from '$lib/server/database';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, cookies, request }) => {
  const user = await requireAuth(cookies);
  const { id: projectId } = params;

  // Get the format from request body
  const { format } = await request.json();

  if (format !== 'pdf' && format !== 'epub') {
    return json({ error: 'Invalid format. Must be "pdf" or "epub"' }, { status: 400 });
  }

  try {
    // Check if the project exists and belongs to the user
    const project = await prisma.bookCreationProject.findUnique({
      where: { id: projectId },
      select: { userId: true, generationStatus: true },
    });

    if (!project) {
      return json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if generation is already in progress
    if (project.generationStatus?.includes('generating')) {
      return json({ error: 'Generation already in progress' }, { status: 409 });
    }

    // Ensure generated directory exists
    await BookGenerationService.ensureGeneratedDir();

    // Start generation based on format
    let url: string;
    if (format === 'pdf') {
      url = await BookGenerationService.generatePDF(projectId);
    } else {
      url = await BookGenerationService.generateEPub(projectId);
    }

    return json({
      success: true,
      url,
      message: `${format.toUpperCase()} generated successfully`,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return json(
      {
        error: 'Generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

export const GET: RequestHandler = async ({ params, cookies }) => {
  const user = await requireAuth(cookies);
  const { id: projectId } = params;

  try {
    // Get generation status
    const project = await prisma.bookCreationProject.findUnique({
      where: { id: projectId },
      select: {
        userId: true,
        generationStatus: true,
        generationError: true,
        pdfUrl: true,
        epubUrl: true,
        lastGeneratedAt: true,
      },
    });

    if (!project) {
      return json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    return json({
      status: project.generationStatus || null,
      error: project.generationError || null,
      pdfUrl: project.pdfUrl || null,
      epubUrl: project.epubUrl || null,
      lastGeneratedAt: project.lastGeneratedAt || null,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return json({ error: 'Failed to get generation status' }, { status: 500 });
  }
};
