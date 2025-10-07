import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTable1759813768071 implements MigrationInterface {
    name = 'AddTable1759813768071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PostCategories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b0a47bd5bf7480228ec50afe8a7" UNIQUE ("name"), CONSTRAINT "UQ_304e9211415da71b99745301bd3" UNIQUE ("slug"), CONSTRAINT "PK_5da1ec0f6875a66bf60723ed27b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LikePosts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "postId" integer, CONSTRAINT "PK_0eb7d02691216d5dd0bf7379c4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Posts_status_enum" AS ENUM('draft', 'published', 'archived')`);
        await queryRunner.query(`CREATE TABLE "Posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "desc" text NOT NULL, "content" text, "img" text, "status" "public"."Posts_status_enum" NOT NULL DEFAULT 'draft', "is_featured" boolean NOT NULL DEFAULT false, "views" integer NOT NULL DEFAULT '0', "published_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "categoryId" integer, CONSTRAINT "UQ_47950594e46a14cd4dd6facbd03" UNIQUE ("slug"), CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LikeComments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "commentId" integer, CONSTRAINT "PK_c1ede9c9f7171e3d4731acefa03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Comments" ("id" SERIAL NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "postId" integer, CONSTRAINT "PK_91e576c94d7d4f888c471fb43de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "username" character varying NOT NULL, "avatar" text, "fullname" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "phoneVerified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "role" "public"."Users_role_enum" NOT NULL DEFAULT '2904', "resetPwdToken" character varying, "resetPwdExpires" TIMESTAMP, "passwordChangedAt" TIMESTAMP, "refreshToken" character varying, "registerToken" character varying, "registerExpires" TIMESTAMP, "otp" character varying, "otpExpires" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "LikePosts" ADD CONSTRAINT "FK_5f39b2d807150954b3218dc0ca8" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LikePosts" ADD CONSTRAINT "FK_6f64d072e2d5571d4e42d2e5dec" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Posts" ADD CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Posts" ADD CONSTRAINT "FK_4e98e49f8dc9c258753bc389386" FOREIGN KEY ("categoryId") REFERENCES "PostCategories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LikeComments" ADD CONSTRAINT "FK_0c673bb7767c60312faeeba6dd2" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LikeComments" ADD CONSTRAINT "FK_d663ba247225908c27817f0871d" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`);
        await queryRunner.query(`ALTER TABLE "LikeComments" DROP CONSTRAINT "FK_d663ba247225908c27817f0871d"`);
        await queryRunner.query(`ALTER TABLE "LikeComments" DROP CONSTRAINT "FK_0c673bb7767c60312faeeba6dd2"`);
        await queryRunner.query(`ALTER TABLE "Posts" DROP CONSTRAINT "FK_4e98e49f8dc9c258753bc389386"`);
        await queryRunner.query(`ALTER TABLE "Posts" DROP CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8"`);
        await queryRunner.query(`ALTER TABLE "LikePosts" DROP CONSTRAINT "FK_6f64d072e2d5571d4e42d2e5dec"`);
        await queryRunner.query(`ALTER TABLE "LikePosts" DROP CONSTRAINT "FK_5f39b2d807150954b3218dc0ca8"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "Comments"`);
        await queryRunner.query(`DROP TABLE "LikeComments"`);
        await queryRunner.query(`DROP TABLE "Posts"`);
        await queryRunner.query(`DROP TYPE "public"."Posts_status_enum"`);
        await queryRunner.query(`DROP TABLE "LikePosts"`);
        await queryRunner.query(`DROP TABLE "PostCategories"`);
    }

}
