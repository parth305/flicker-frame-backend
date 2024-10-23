import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersSchema1721647134689 implements MigrationInterface {
  name = 'UsersSchema1721647134689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "userName" character varying NOT NULL, "userEmail" character varying NOT NULL, "userPassword" character varying NOT NULL, "userRole" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_85432bb369f1a54116c4e4d2ee2" UNIQUE ("userEmail"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
