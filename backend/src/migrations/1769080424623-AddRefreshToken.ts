import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshToken1769080424623 implements MigrationInterface {
    name = 'AddRefreshToken1769080424623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    }

}
