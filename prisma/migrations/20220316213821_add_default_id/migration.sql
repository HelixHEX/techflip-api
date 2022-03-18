-- AlterTable
CREATE SEQUENCE "listing_id_seq";
ALTER TABLE "Listing" ALTER COLUMN "id" SET DEFAULT nextval('listing_id_seq');
ALTER SEQUENCE "listing_id_seq" OWNED BY "Listing"."id";

-- AlterTable
CREATE SEQUENCE "post_id_seq";
ALTER TABLE "Post" ALTER COLUMN "id" SET DEFAULT nextval('post_id_seq');
ALTER SEQUENCE "post_id_seq" OWNED BY "Post"."id";
