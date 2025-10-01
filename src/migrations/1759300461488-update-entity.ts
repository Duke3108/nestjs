import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1759300461488 implements MigrationInterface {
    name = 'UpdateEntity1759300461488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "registerExpires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "registerExpires"`);
    }

}
