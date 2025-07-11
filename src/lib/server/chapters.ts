import { prisma } from '$lib/server/database';
import type { Chapter } from '@prisma/client';

export async function getChapterById(id: string): Promise<Chapter | null> {
  return prisma.chapter.findUnique({
    where: { id },
  });
}

export async function getChaptersByBookId(bookId: string): Promise<Chapter[]> {
  return prisma.chapter.findMany({
    where: { bookId },
    orderBy: [{ partNumber: 'asc' }, { order: 'asc' }],
  });
}

export async function getNextChapter(
  bookId: string,
  currentPartNumber: number,
  currentOrder: number
): Promise<Chapter | null> {
  // 同じパート内の次の章を探す
  const nextInPart = await prisma.chapter.findFirst({
    where: {
      bookId,
      partNumber: currentPartNumber,
      order: { gt: currentOrder },
    },
    orderBy: { order: 'asc' },
  });

  if (nextInPart) {
    return nextInPart;
  }

  // 次のパートの最初の章を探す
  return prisma.chapter.findFirst({
    where: {
      bookId,
      partNumber: { gt: currentPartNumber },
    },
    orderBy: [{ partNumber: 'asc' }, { order: 'asc' }],
  });
}

export async function getPreviousChapter(
  bookId: string,
  currentPartNumber: number,
  currentOrder: number
): Promise<Chapter | null> {
  // 同じパート内の前の章を探す
  const prevInPart = await prisma.chapter.findFirst({
    where: {
      bookId,
      partNumber: currentPartNumber,
      order: { lt: currentOrder },
    },
    orderBy: { order: 'desc' },
  });

  if (prevInPart) {
    return prevInPart;
  }

  // 前のパートの最後の章を探す
  return prisma.chapter.findFirst({
    where: {
      bookId,
      partNumber: { lt: currentPartNumber },
    },
    orderBy: [{ partNumber: 'desc' }, { order: 'desc' }],
  });
}
