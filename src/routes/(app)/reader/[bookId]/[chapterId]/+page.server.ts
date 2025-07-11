import type { PageServerLoad } from './$types';
import { getBookWithChapters } from '$lib/server/books';
import { getChapterById } from '$lib/server/chapters';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const [book, chapter] = await Promise.all([
      getBookWithChapters(params.bookId),
      getChapterById(params.chapterId),
    ]);

    if (!book) {
      throw error(404, 'Book not found');
    }

    if (!chapter || chapter.bookId !== book.id) {
      throw error(404, 'Chapter not found');
    }

    if (!book.isPublished) {
      throw error(403, 'Book is not published');
    }

    // 現在の章のインデックスを取得
    const currentIndex = book.chapters.findIndex((ch) => ch.id === chapter.id);
    const previousChapter = currentIndex > 0 ? book.chapters[currentIndex - 1] : null;
    const nextChapter =
      currentIndex < book.chapters.length - 1 ? book.chapters[currentIndex + 1] : null;

    return {
      book,
      chapter,
      previousChapter,
      nextChapter,
      totalChapters: book.chapters.length,
      currentChapterIndex: currentIndex + 1,
    };
  } catch (err) {
    console.error('Error loading chapter:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Failed to load chapter');
  }
};
