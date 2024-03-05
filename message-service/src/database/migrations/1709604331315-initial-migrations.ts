import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrations1709604331315 implements MigrationInterface {
  name = "InitialMigrations1709604331315";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "message" DROP COLUMN "ReceiverId"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "message" ADD "ReceiverId" integer');
  }
}
