-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_approverId_fkey";
-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_authorId_fkey";
-- AddForeignKey
ALTER TABLE "Complaint"
ADD CONSTRAINT "Complaint_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Complaint"
ADD CONSTRAINT "Complaint_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;