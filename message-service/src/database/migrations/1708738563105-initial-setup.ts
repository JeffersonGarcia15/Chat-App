import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1708738563105 implements MigrationInterface {
  name = "InitialSetup1708738563105";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "group_member" ("Id" SERIAL NOT NULL, "GroupId" integer NOT NULL, "UserId" integer NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5f7827838e6a40e7c96b43ecaae" PRIMARY KEY ("Id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "group" ("Id" SERIAL NOT NULL, "Name" character varying(100) NOT NULL, "Description" character varying(200), "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1e8fa93b3036afa89c5c2d883a4" PRIMARY KEY ("Id"))',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"message_status_enum\" AS ENUM('edited', 'deleted')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"message_type_enum\" AS ENUM('text', 'image', 'video', 'audio', 'file')",
    );
    await queryRunner.query(
      'CREATE TABLE "message" ("Id" SERIAL NOT NULL, "Content" text NOT NULL, "SenderId" integer NOT NULL, "ReceiverId" integer, "GroupId" integer, "Status" "public"."message_status_enum" NOT NULL, "Type" "public"."message_type_enum" NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2dd17579e270650c22b68232b0e" PRIMARY KEY ("Id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "group_member" ADD CONSTRAINT "FK_a299db94aca6f77af90535d0d54" FOREIGN KEY ("GroupId") REFERENCES "group"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "message" ADD CONSTRAINT "FK_38610886250304a2103f7b209fc" FOREIGN KEY ("GroupId") REFERENCES "group"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "message" DROP CONSTRAINT "FK_38610886250304a2103f7b209fc"',
    );
    await queryRunner.query(
      'ALTER TABLE "group_member" DROP CONSTRAINT "FK_a299db94aca6f77af90535d0d54"',
    );
    await queryRunner.query('DROP TABLE "message"');
    await queryRunner.query('DROP TYPE "public"."message_type_enum"');
    await queryRunner.query('DROP TYPE "public"."message_status_enum"');
    await queryRunner.query('DROP TABLE "group"');
    await queryRunner.query('DROP TABLE "group_member"');
  }
}
