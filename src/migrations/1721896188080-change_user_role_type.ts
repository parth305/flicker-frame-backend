import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserRoleType1721896188080 implements MigrationInterface {
  name = 'ChangeUserRoleType1721896188080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userRole"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_userrole_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "userRole" "public"."user_userrole_enum" NOT NULL DEFAULT 'user'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userRole"`);
    await queryRunner.query(`DROP TYPE "public"."user_userrole_enum"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "userRole" character varying NOT NULL`,
    );
  }
}
