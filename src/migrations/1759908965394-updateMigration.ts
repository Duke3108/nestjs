import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMigration1759908965394 implements MigrationInterface {
  name = 'UpdateMigration1759908965394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Posts" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "Posts" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "PostCategories" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostCategories" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostCategories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostCategories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PostCategories" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostCategories" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(`ALTER TABLE "Posts" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "Posts" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "PostCategories" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostCategories" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
