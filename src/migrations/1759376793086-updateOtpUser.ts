import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOtpUser1759376793086 implements MigrationInterface {
    name = 'UpdateOtpUser1759376793086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "otp" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "otpExpires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "otpExpires"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "otp"`);
    }

}
