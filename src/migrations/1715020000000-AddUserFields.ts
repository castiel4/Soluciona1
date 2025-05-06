import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFields1715020000000 implements MigrationInterface {
    name = 'AddUserFields1715020000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, criamos o tipo enum
        await queryRunner.query(`
            CREATE TYPE "public"."usuarios_tipo_enum" AS ENUM('prestador', 'solicitante')
        `);

        // Adicionamos as novas colunas
        await queryRunner.query(`
            ALTER TABLE "usuarios" 
            ADD COLUMN "tipo" "public"."usuarios_tipo_enum" NOT NULL DEFAULT 'solicitante',
            ADD COLUMN "foto_perfil" character varying(255),
            ADD COLUMN "telefone" character varying(20),
            ADD COLUMN "endereco" character varying(255),
            ADD COLUMN "biografia" text,
            ADD COLUMN "avaliacao_media" decimal(10,2),
            ADD COLUMN "total_avaliacoes" integer NOT NULL DEFAULT 0,
            ADD COLUMN "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Removemos as colunas
        await queryRunner.query(`
            ALTER TABLE "usuarios" 
            DROP COLUMN "tipo",
            DROP COLUMN "foto_perfil",
            DROP COLUMN "telefone",
            DROP COLUMN "endereco",
            DROP COLUMN "biografia",
            DROP COLUMN "avaliacao_media",
            DROP COLUMN "total_avaliacoes",
            DROP COLUMN "data_atualizacao"
        `);

        // Removemos o tipo enum
        await queryRunner.query(`
            DROP TYPE "public"."usuarios_tipo_enum"
        `);
    }
} 