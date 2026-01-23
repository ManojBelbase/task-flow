import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1769005965728 implements MigrationInterface {
    name = 'InitialSetup1769005965728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create tasks_status_enum only if it doesn't exist
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."tasks_status_enum" AS ENUM('pending', 'in_progress', 'completed');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create users_role_enum only if it doesn't exist
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create users table first (since tasks references it)
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "name" character varying NOT NULL, 
                "email" character varying NOT NULL, 
                "password" character varying NOT NULL, 
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")`);

        // Create tasks table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "title" character varying NOT NULL, 
                "description" text, 
                "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'pending', 
                "userId" uuid NOT NULL, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_6086c8dafbae729a930c04d865" ON "tasks" ("status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_166bd96559cb38595d392f75a3" ON "tasks" ("userId")`);

        // Add foreign key constraint (use DO block to handle if already exists)
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" 
                FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_166bd96559cb38595d392f75a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6086c8dafbae729a930c04d865"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    }

}
