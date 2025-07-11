export interface ReadingSessionData {
  bookId: string;
  chapterId: string;
  startedAt: Date;
  lastReadAt: Date;
  percentage: number;
  position: number;
}

export interface ReadingProgress {
  bookId: string;
  chapterId: string;
  percentage: number;
  lastReadAt: Date;
}

export interface BookProgress {
  bookId: string;
  totalChapters: number;
  completedChapters: number;
  overallPercentage: number;
  lastChapterRead?: {
    chapterId: string;
    chapterTitle: string;
    lastReadAt: Date;
  };
}

export interface ReadingStats {
  totalBooksStarted: number;
  totalBooksCompleted: number;
  totalReadingTime: number; // in minutes
  currentStreak: number; // days
  longestStreak: number; // days
}

export interface BookmarkData {
  id: string;
  bookId: string;
  chapterId: string;
  position: number;
  note?: string;
  createdAt: Date;
}

export interface HighlightData {
  id: string;
  bookId: string;
  chapterId: string;
  text: string;
  startPosition: number;
  endPosition: number;
  color: 'yellow' | 'green' | 'blue' | 'pink';
  note?: string;
  createdAt: Date;
}
