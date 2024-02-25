import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1708773087248 implements MigrationInterface {
  name = 'CreateUsersTable1708773087248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`refresh_token\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
