import type { PageServerLoad } from './$types';
import { getBookWithChapters } from '$lib/server/books';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const book = await getBookWithChapters(params.bookId);

    if (!book) {
      throw error(404, 'Book not found');
    }

    if (!book.isPublished) {
      throw error(403, 'Book is not published');
    }

    // 最初の章のIDを取得
    const firstChapterId =
      book.chapters.length > 0 && book.chapters[0] ? book.chapters[0].id : null;

    return {
      book,
      firstChapterId,
    };
  } catch (err) {
    console.error('Error loading book:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Failed to load book');
  }
};
