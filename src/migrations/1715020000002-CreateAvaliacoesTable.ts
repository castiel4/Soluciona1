import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAvaliacoesTable1715020000002 implements MigrationInterface {
    name = 'CreateAvaliacoesTable1715020000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "avaliacoes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "nota" integer NOT NULL CHECK (nota >= 1 AND nota <= 5),
                "comentario" text,
                "cliente_id" varchar NOT NULL,
                "prestador_id" varchar NOT NULL,
                "servico_id" uuid NOT NULL,
                "data_criacao" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_cliente" FOREIGN KEY ("cliente_id") REFERENCES "usuarios"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_prestador" FOREIGN KEY ("prestador_id") REFERENCES "usuarios"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_servico" FOREIGN KEY ("servico_id") REFERENCES "services"("id") ON DELETE CASCADE,
                CONSTRAINT "unique_avaliacao_servico_cliente" UNIQUE ("servico_id", "cliente_id")
            )
        `);

        // Índices para melhorar performance
        await queryRunner.query(`
            CREATE INDEX "idx_avaliacoes_prestador" ON "avaliacoes"("prestador_id");
            CREATE INDEX "idx_avaliacoes_servico" ON "avaliacoes"("servico_id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_avaliacoes_servico"`);
        await queryRunner.query(`DROP INDEX "idx_avaliacoes_prestador"`);
        await queryRunner.query(`DROP TABLE "avaliacoes"`);
    }
} 