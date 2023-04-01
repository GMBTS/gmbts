-- CreateTable
CREATE TABLE "WhiteListAccounts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "WhiteListAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhiteListAccounts_accountId_key" ON "WhiteListAccounts"("accountId");

-- AddForeignKey
ALTER TABLE "WhiteListAccounts" ADD CONSTRAINT "WhiteListAccounts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
