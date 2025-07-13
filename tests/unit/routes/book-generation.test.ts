import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '../../../src/routes/(app)/book-projects/[id]/generate/+server';
import { BookGenerationService } from '$lib/server/book-generation';
import { prisma } from '$lib/server/database';
import { requireAuth } from '$lib/server/auth-helper';

// Mock dependencies
vi.mock('$lib/server/auth-helper');
vi.mock('$lib/server/database', () => ({
  prisma: {
    bookCreationProject: {
      findUnique: vi.fn(),
    },
  },
}));
vi.mock('$lib/server/book-generation');

describe('Book Generation Endpoints', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com', name: 'Test User' };
  const mockProject = {
    id: 'project-123',
    userId: 'user-123',
    generationStatus: null,
    pdfUrl: null,
    epubUrl: null,
    lastGeneratedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(mockUser);
    vi.mocked(BookGenerationService.ensureGeneratedDir).mockResolvedValue(undefined);
  });

  describe('POST /book-projects/[id]/generate', () => {
    it('should generate PDF successfully', async () => {
      // Mock data
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject);
      vi.mocked(BookGenerationService.generatePDF).mockResolvedValue('/generated/test.pdf');

      // Create request
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ format: 'pdf' }),
      });

      // Call endpoint
      const response = await POST({
        params: { id: 'project-123' },
        cookies: {} as any,
        request,
      } as any);

      // Parse response
      const result = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(result).toEqual({
        success: true,
        url: '/generated/test.pdf',
        message: 'PDF generated successfully',
      });
      expect(BookGenerationService.generatePDF).toHaveBeenCalledWith('project-123');
    });

    it('should generate ePub successfully', async () => {
      // Mock data
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(mockProject);
      vi.mocked(BookGenerationService.generateEPub).mockResolvedValue('/generated/test.epub');

      // Create request
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ format: 'epub' }),
      });

      // Call endpoint
      const response = await POST({
        params: { id: 'project-123' },
        cookies: {} as any,
        request,
      } as any);

      // Parse response
      const result = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(result).toEqual({
        success: true,
        url: '/generated/test.epub',
        message: 'EPUB generated successfully',
      });
      expect(BookGenerationService.generateEPub).toHaveBeenCalledWith('project-123');
    });

    it('should return 400 for invalid format', async () => {
      // Create request
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ format: 'invalid' }),
      });

      // Call endpoint
      const response = await POST({
        params: { id: 'project-123' },
        cookies: {} as any,
        request,
      } as any);

      // Parse response
      const result = await response.json();

      // Assertions
      expect(response.status).toBe(400);
      expect(result).toEqual({
        error: 'Invalid format. Must be "pdf" or "epub"',
      });
    });

    it('should return 404 when project not found', async () => {
      // Mock data
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(null);

      // Create request
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ format: 'pdf' }),
      });

      // Call endpoint
      const response = await POST({
        params: { id: 'project-123' },
        cookies: {} as any,
        request,
      } as any);

      // Parse response
      const result = await response.json();

      // Assertions
      expect(response.status).toBe(404);
      expect(result).toEqual({
        error: 'Project not found',
      });
    });

    it('should return 403 when user is not the owner', async () => {
      // Mock data
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue({
        ...mockProject,
        userId: 'other-user',
      });

      // Create request
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ format: 'pdf' }),
      });

      // Call endpoint
      const response = await POST({
        params: { id: 'project-123' },
        cookies: {} as any,
        request,
      } as any);

      // Parse response
      const result = await response.json();

      // Assertions
      expect(response.status).toBe(403);
      expect(result).toEqual({
        error: 'Unauthorized',
      });
    });

    it('should return 409 when generation is already in progress', async () => {
      // Mock data
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue({
        ...mockProject,
        generationStatus: 'generating_pdf',
      });

      // Create request
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ format: 'pdf' }),
      });

      // Call endpoint
      const response = await POST({
        params: { id: 'project-123' },
        cookies: {} as any,
        request,
      } as any);

      // Parse response
      const result = await response.json();

      // Assertions
      expect(response.status).toBe(409);
      expect(result).toEqual({
        error: 'Generation already in progress',
      });
    });
  });

  describe('GET /book-projects/[id]/generate', () => {
    it('should return generation status', async () => {
      // Mock data
      const projectWithStatus = {
        ...mockProject,
        generationStatus: 'completed',
        pdfUrl: '/generated/test.pdf',
        epubUrl: '/generated/test.epub',
        lastGeneratedAt: new Date('2025-07-13T10:00:00Z'),
      };
      vi.mocked(prisma.bookCreationProject.findUnique).mockResolvedValue(projectWithStatus);

      // Call endpoint
      const response = await GET({
        params: { id: 'project-123' },
        cookies: {} as any,
      } as any);

      // Parse response
      const result = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(result.status).toBe('completed');
      expect(result.pdfUrl).toBe('/generated/test.pdf');
      expect(result.epubUrl).toBe('/generated/test.epub');
      expect(result.lastGeneratedAt).toBe('2025-07-13T10:00:00.000Z');
    });
  });
});
