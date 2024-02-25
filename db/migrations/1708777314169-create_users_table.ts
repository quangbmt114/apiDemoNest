import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1708777314169 implements MigrationInterface {
  name = 'CreateUsersTable1708777314169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`create_at\` \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`update_at\` \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`update_at\` \`update_at\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`create_at\` \`create_at\` datetime(0) NOT NULL`,
    );
  }
}
