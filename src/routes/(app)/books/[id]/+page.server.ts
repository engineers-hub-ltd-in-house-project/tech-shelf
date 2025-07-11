import type { PageServerLoad } from './$types';
import { getBookWithChapters, getRelatedBooks } from '$lib/server/books';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const book = await getBookWithChapters(params.id);

    if (!book || !book.isPublished) {
      throw error(404, 'Book not found');
    }

    const relatedBooks = await getRelatedBooks(book.id, book.tags, 4);

    return {
      book,
      relatedBooks,
    };
  } catch (err) {
    console.error('Error loading book:', err);
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Failed to load book');
  }
};
