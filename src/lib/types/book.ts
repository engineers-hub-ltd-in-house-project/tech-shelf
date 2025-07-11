export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string | null;
  price: number;
  currency: 'JPY' | 'USD' | 'EUR';
  language: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  chapters: Chapter[];
  tags: string[];
  isPublished: boolean;
  authorId: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  estimatedReadingTime: number;
  partNumber: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookMetadata {
  isbn?: string;
  publisher?: string;
  pageCount?: number;
  format: 'epub' | 'pdf' | 'web';
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum BookCategory {
  PROGRAMMING = 'programming',
  WEB_DEVELOPMENT = 'web-development',
  MOBILE_DEVELOPMENT = 'mobile-development',
  DATA_SCIENCE = 'data-science',
  DEVOPS = 'devops',
  ARCHITECTURE = 'architecture',
  OTHER = 'other',
}
