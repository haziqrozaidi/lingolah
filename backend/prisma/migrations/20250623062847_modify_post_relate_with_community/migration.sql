-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "community_id" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("community_id") ON DELETE CASCADE ON UPDATE CASCADE;
