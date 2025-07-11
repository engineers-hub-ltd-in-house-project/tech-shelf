import { prisma } from '$lib/server/database';
import type { ReadingSession } from '@prisma/client';

export interface ReadingProgress {
  bookId: string;
  chapterId: string;
  percentage: number;
  lastReadAt: Date;
}

export async function createReadingSession(
  userId: string,
  bookId: string,
  chapterId: string,
  device?: string
): Promise<ReadingSession> {
  return prisma.readingSession.create({
    data: {
      userId,
      bookId,
      chapterId,
      position: 0,
      percentage: 0,
      device: device || 'web',
    },
  });
}

export async function updateReadingProgress(
  sessionId: string,
  position: number,
  percentage: number
): Promise<ReadingSession> {
  return prisma.readingSession.update({
    where: { id: sessionId },
    data: {
      position,
      percentage,
      lastReadAt: new Date(),
    },
  });
}

export async function getReadingSession(
  userId: string,
  bookId: string,
  chapterId: string
): Promise<ReadingSession | null> {
  return prisma.readingSession.findFirst({
    where: {
      userId,
      bookId,
      chapterId,
    },
    orderBy: { lastReadAt: 'desc' },
  });
}

export async function getLastReadingSession(
  userId: string,
  bookId: string
): Promise<ReadingSession | null> {
  return prisma.readingSession.findFirst({
    where: {
      userId,
      bookId,
    },
    orderBy: { lastReadAt: 'desc' },
  });
}

export async function getReadingHistory(userId: string, limit = 10): Promise<ReadingSession[]> {
  return prisma.readingSession.findMany({
    where: { userId },
    orderBy: { lastReadAt: 'desc' },
    take: limit,
    include: {
      book: {
        select: {
          title: true,
          author: true,
          coverImage: true,
        },
      },
      chapter: {
        select: {
          title: true,
          order: true,
          partNumber: true,
        },
      },
    },
  });
}

export async function calculateBookProgress(userId: string, bookId: string): Promise<number> {
  const [totalChapters, readChapters] = await Promise.all([
    prisma.chapter.count({
      where: { bookId },
    }),
    prisma.readingSession.findMany({
      where: {
        userId,
        bookId,
        percentage: { gte: 90 }, // 90%以上読んだ章をカウント
      },
      distinct: ['chapterId'],
    }),
  ]);

  if (totalChapters === 0) return 0;

  return Math.round((readChapters.length / totalChapters) * 100);
}
