import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUsuariosEndereco1715020000001 implements MigrationInterface {
    name = 'AlterUsuariosEndereco1715020000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, vamos criar uma coluna temporária para o novo formato
        await queryRunner.query(`
            ALTER TABLE "usuarios" 
            ADD COLUMN "endereco_novo" jsonb NULL
        `);

        // Atualizar os endereços existentes para o formato JSON
        await queryRunner.query(`
            UPDATE "usuarios"
            SET "endereco_novo" = json_build_object(
                'rua', COALESCE(split_part("endereco", ',', 1), ''),
                'numero', COALESCE(substring(split_part("endereco", ',', 2) from '^\s*(\d+)'), ''),
                'bairro', COALESCE(split_part("endereco", ',', 3), ''),
                'cidade', COALESCE(split_part("endereco", ',', 4), ''),
                'estado', 'SP',
                'cep', ''
            )
            WHERE "endereco" IS NOT NULL
        `);

        // Remover a coluna antiga
        await queryRunner.query(`
            ALTER TABLE "usuarios" 
            DROP COLUMN "endereco"
        `);

        // Renomear a nova coluna
        await queryRunner.query(`
            ALTER TABLE "usuarios" 
            RENAME COLUMN "endereco_novo" TO "endereco"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Criar coluna temporária para texto
        await queryRunner.query(`
            ALTER TABLE "usuarios" 
            ADD COLUMN "endereco_texto" character varying(255)
        `);

        // Converter JSON de volta para texto
        await queryRunner.query(`
            UPDATE "usuarios"
            SET "endereco_texto" = CONCAT(
                "endereco"->>'rua', ', ',
                "endereco"->>'numero', ', ',
                "endereco"->>'bairro', ', ',
                "endereco"->>'cidade', ', ',
                "endereco"->>'estado'
            )
            WHERE "endereco" IS NOT NULL
        `);

        // Remover coluna JSON
        await queryRunner.query(`
            ALTER TABLE "usuarios" 
            DROP COLUMN "endereco"
        `);

        // Renomear coluna de texto
        await queryRunner.query(`
            ALTER TABLE "usuarios" 
            RENAME COLUMN "endereco_texto" TO "endereco"
        `);
    }
} 