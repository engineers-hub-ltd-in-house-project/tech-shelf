export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  providers: AuthProvider[];
  purchasedBooks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthProvider {
  provider: 'google' | 'github' | 'email';
  providerId: string;
  email: string;
}

export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  chapterId: string;
  position: number;
  percentage: number;
  lastReadAt: Date;
  device: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  bookId: string;
  chapterId: string;
  position: number;
  note?: string;
  color?: string;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  readingSpeed: number;
}
