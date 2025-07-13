import { requireAuth } from '$lib/server/auth-helper';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';

export const GET: RequestHandler = async ({ params, cookies }) => {
  // Require authentication to download generated files
  await requireAuth(cookies);

  const { filename } = params;

  // Security: prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return new Response('Invalid filename', { status: 400 });
  }

  const filepath = path.join(process.cwd(), 'static/generated', filename);

  try {
    const fileBuffer = await fs.readFile(filepath);
    const ext = path.extname(filename).toLowerCase();

    let contentType = 'application/octet-stream';
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.epub') {
      contentType = 'application/epub+zip';
    }

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('File not found:', error);
    return new Response('File not found', { status: 404 });
  }
};
