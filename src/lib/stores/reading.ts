import { writable } from 'svelte/store';
import type { ReadingSessionData, ReadingProgress } from '$lib/types/reading';

interface ReadingState {
  currentSession: ReadingSessionData | null;
  sessions: Map<string, ReadingSessionData>;
  bookProgress: Map<string, number>;
}

function createReadingStore() {
  const { subscribe, set, update } = writable<ReadingState>({
    currentSession: null,
    sessions: new Map(),
    bookProgress: new Map(),
  });

  return {
    subscribe,

    startSession(bookId: string, chapterId: string) {
      update((state) => {
        const sessionKey = `${bookId}-${chapterId}`;
        const existingSession = state.sessions.get(sessionKey);

        const session: ReadingSessionData = existingSession || {
          bookId,
          chapterId,
          startedAt: new Date(),
          lastReadAt: new Date(),
          percentage: 0,
          position: 0,
        };

        state.currentSession = session;
        state.sessions.set(sessionKey, session);
        return state;
      });
    },

    updateProgress(bookId: string, chapterId: string, percentage: number) {
      update((state) => {
        const sessionKey = `${bookId}-${chapterId}`;
        const session = state.sessions.get(sessionKey);

        if (session) {
          session.percentage = percentage;
          session.lastReadAt = new Date();
          state.sessions.set(sessionKey, session);
        }

        return state;
      });
    },

    getProgress(bookId: string, chapterId: string): ReadingProgress | null {
      let progress: ReadingProgress | null = null;

      subscribe((state) => {
        const sessionKey = `${bookId}-${chapterId}`;
        const session = state.sessions.get(sessionKey);

        if (session) {
          progress = {
            bookId: session.bookId,
            chapterId: session.chapterId,
            percentage: session.percentage,
            lastReadAt: session.lastReadAt,
          };
        }
      })();

      return progress;
    },

    endSession() {
      update((state) => {
        state.currentSession = null;
        return state;
      });
    },

    updateBookProgress(bookId: string, percentage: number) {
      update((state) => {
        state.bookProgress.set(bookId, percentage);
        return state;
      });
    },

    getBookProgress(bookId: string): number {
      let progress = 0;

      subscribe((state) => {
        progress = state.bookProgress.get(bookId) || 0;
      })();

      return progress;
    },

    clearAllSessions() {
      set({
        currentSession: null,
        sessions: new Map(),
        bookProgress: new Map(),
      });
    },
  };
}

export const reading = createReadingStore();
