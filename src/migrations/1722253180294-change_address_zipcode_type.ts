import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAddressZipcodeType1722253180294
  implements MigrationInterface
{
  name = 'ChangeAddressZipcodeType1722253180294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" ALTER "zipCode" TYPE INT USING "zipCode"::integer;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" ALTER "zipCode" TYPE character varying NOT NULL`,
    );
  }
}
