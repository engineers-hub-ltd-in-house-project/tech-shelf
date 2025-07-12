-- CreateTable
CREATE TABLE "book_creation_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bookId" TEXT,
    CONSTRAINT "book_creation_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "book_creation_projects_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "book_project_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "includeInBook" BOOLEAN NOT NULL DEFAULT true,
    "chapterId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "book_project_posts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "book_creation_projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "book_project_posts_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "book_project_posts_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "book_project_chapters" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "book_project_chapters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "book_project_chapters_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "book_creation_projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "book_creation_projects_bookId_key" ON "book_creation_projects"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "book_project_posts_projectId_blogPostId_key" ON "book_project_posts"("projectId", "blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "book_project_chapters_projectId_order_key" ON "book_project_chapters"("projectId", "order");
