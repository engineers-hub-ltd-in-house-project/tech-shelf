-- AlterTable
ALTER TABLE "book_creation_projects" ADD COLUMN "epubUrl" TEXT;
ALTER TABLE "book_creation_projects" ADD COLUMN "generationError" TEXT;
ALTER TABLE "book_creation_projects" ADD COLUMN "generationStatus" TEXT;
ALTER TABLE "book_creation_projects" ADD COLUMN "lastGeneratedAt" DATETIME;
ALTER TABLE "book_creation_projects" ADD COLUMN "pdfUrl" TEXT;

-- CreateTable
CREATE TABLE "blog_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blogPostId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BLOB NOT NULL,
    "alt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blog_images_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
