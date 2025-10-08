import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePost1759889748238 implements MigrationInterface {
    name = 'UpdatePost1759889748238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "username" character varying NOT NULL, "avatar" text, "fullname" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "phoneVerified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "role" "public"."Users_role_enum" NOT NULL DEFAULT '2904', "resetPwdToken" character varying, "resetPwdExpires" TIMESTAMP, "passwordChangedAt" TIMESTAMP, "refreshToken" character varying, "registerToken" character varying, "registerExpires" TIMESTAMP, "otp" character varying, "otpExpires" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "avatar" text`);
        await queryRunner.query(`ALTER TABLE "LikeComments" ADD CONSTRAINT "FK_0c673bb7767c60312faeeba6dd2" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LikePosts" ADD CONSTRAINT "FK_5f39b2d807150954b3218dc0ca8" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Posts" ADD CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Posts" DROP CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8"`);
        await queryRunner.query(`ALTER TABLE "LikePosts" DROP CONSTRAINT "FK_5f39b2d807150954b3218dc0ca8"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`);
        await queryRunner.query(`ALTER TABLE "LikeComments" DROP CONSTRAINT "FK_0c673bb7767c60312faeeba6dd2"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "avatar" text`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username")`);
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
