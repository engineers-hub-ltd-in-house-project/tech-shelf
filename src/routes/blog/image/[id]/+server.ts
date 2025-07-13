import { prisma } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;

  try {
    const image = await prisma.blogImage.findUnique({
      where: { id },
      select: {
        data: true,
        mimeType: true,
        filename: true,
      },
    });

    if (!image) {
      return new Response('Image not found', { status: 404 });
    }

    // Base64からBufferに変換
    const buffer = Buffer.from(image.data);

    return new Response(buffer, {
      headers: {
        'Content-Type': image.mimeType,
        'Content-Disposition': `inline; filename="${image.filename}"`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Failed to fetch image:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
