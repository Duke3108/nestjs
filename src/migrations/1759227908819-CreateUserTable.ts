import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1759227908819 implements MigrationInterface {
    name = 'CreateUserTable1759227908819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "fullname" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "phoneVerified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "role" "public"."Users_role_enum" NOT NULL DEFAULT '2904', "resetPwdToken" character varying, "resetPwdExpires" TIMESTAMP, "passwordChangedAt" TIMESTAMP, "refreshToken" character varying, "registerToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_f0444b8b5c111257c300932ae06" UNIQUE ("phone"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
