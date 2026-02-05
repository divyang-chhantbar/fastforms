-- CreateTable
CREATE TABLE "Forms" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormsResponses" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormsResponses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Forms_slug_key" ON "Forms"("slug");

-- CreateIndex
CREATE INDEX "Forms_userId_idx" ON "Forms"("userId");

-- CreateIndex
CREATE INDEX "FormsResponses_formId_idx" ON "FormsResponses"("formId");

-- AddForeignKey
ALTER TABLE "FormsResponses" ADD CONSTRAINT "FormsResponses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
