import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1708452011324 implements MigrationInterface {
  name = 'CreateUsersTable1708452011324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`refreshToken\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`refreshToken\``,
    );
  }
}
