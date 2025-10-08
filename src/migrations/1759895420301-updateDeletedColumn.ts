import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDeletedColumn1759895420301 implements MigrationInterface {
  name = 'UpdateDeletedColumn1759895420301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PostCategories" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "Posts" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "Comments" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Comments" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "Posts" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "PostCategories" DROP COLUMN "deletedAt"`,
    );
  }
}
