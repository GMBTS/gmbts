-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Complaint" (
    "complaintId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "images" TEXT[],
    "licensePlate" TEXT,
    "authorId" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "approvedAt" TIMESTAMP(3),
    "approverId" TEXT,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("complaintId")
);

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
