-- CreateTable
CREATE TABLE "Profile" (
    "profileId" UUID NOT NULL,
    "bio" TEXT,
    "ProfileUserId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profileId")
);
-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);
-- CreateTable
CREATE TABLE "Complaint" (
    "complaintId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "images" TEXT [],
    "authorId" UUID NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "approvedAt" TIMESTAMP(3),
    "approverId" UUID,
    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("complaintId")
);
-- CreateIndex
CREATE UNIQUE INDEX "Profile_ProfileUserId_key" ON "Profile"("ProfileUserId");
-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
-- AddForeignKey
ALTER TABLE "Profile"
ADD CONSTRAINT "Profile_ProfileUserId_fkey" FOREIGN KEY ("ProfileUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Complaint"
ADD CONSTRAINT "Complaint_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Complaint"
ADD CONSTRAINT "Complaint_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("userId") ON DELETE
SET NULL ON UPDATE CASCADE;