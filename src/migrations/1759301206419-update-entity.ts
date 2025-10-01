import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntity1759301206419 implements MigrationInterface {
    name = 'UpdateEntity1759301206419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_f0444b8b5c111257c300932ae06"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_f0444b8b5c111257c300932ae06" UNIQUE ("phone")`);
    }

}
