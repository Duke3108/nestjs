import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePost1759899842033 implements MigrationInterface {
  name = 'UpdatePost1759899842033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "desc" text NOT NULL, "content" text, "img" text, "status" "public"."Posts_status_enum" NOT NULL DEFAULT 'draft', "is_featured" boolean NOT NULL DEFAULT false, "views" integer NOT NULL DEFAULT '0', "published_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, "categoryId" integer, CONSTRAINT "UQ_47950594e46a14cd4dd6facbd03" UNIQUE ("slug"), CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Comments" ("id" SERIAL NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, "postId" integer, CONSTRAINT "PK_91e576c94d7d4f888c471fb43de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "LikePosts" ADD CONSTRAINT "FK_6f64d072e2d5571d4e42d2e5dec" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD CONSTRAINT "FK_4e98e49f8dc9c258753bc389386" FOREIGN KEY ("categoryId") REFERENCES "PostCategories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "LikeComments" ADD CONSTRAINT "FK_d663ba247225908c27817f0871d" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" ADD CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Comments" DROP CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "LikeComments" DROP CONSTRAINT "FK_d663ba247225908c27817f0871d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" DROP CONSTRAINT "FK_4e98e49f8dc9c258753bc389386"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" DROP CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "LikePosts" DROP CONSTRAINT "FK_6f64d072e2d5571d4e42d2e5dec"`,
    );
    await queryRunner.query(`DROP TABLE "Comments"`);
    await queryRunner.query(`DROP TABLE "Posts"`);
  }
}
