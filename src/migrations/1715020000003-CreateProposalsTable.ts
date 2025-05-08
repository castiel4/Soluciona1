import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProposalsTable1715020000003 implements MigrationInterface {
    name = 'CreateProposalsTable1715020000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."proposal_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED')
        `);

        await queryRunner.query(`
            CREATE TABLE "proposals" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "descricao" varchar(500) NOT NULL,
                "valor_proposto" decimal(10,2) NOT NULL,
                "status" "public"."proposal_status_enum" NOT NULL DEFAULT 'PENDING',
                "data_criacao" TIMESTAMP NOT NULL DEFAULT now(),
                "data_expiracao" TIMESTAMP NOT NULL,
                "cliente_id" varchar NOT NULL,
                "prestador_id" varchar NOT NULL,
                "servico_id" uuid NOT NULL,
                CONSTRAINT "fk_proposal_cliente" FOREIGN KEY ("cliente_id") REFERENCES "usuarios"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_proposal_prestador" FOREIGN KEY ("prestador_id") REFERENCES "usuarios"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_proposal_servico" FOREIGN KEY ("servico_id") REFERENCES "services"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "proposal_history" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "proposal_id" uuid NOT NULL,
                "status_anterior" "public"."proposal_status_enum",
                "status_novo" "public"."proposal_status_enum" NOT NULL,
                "motivo" varchar(500),
                "usuario_id" varchar NOT NULL,
                "data_alteracao" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_proposal_history_proposal" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_proposal_history_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE
            )
        `);

        // Índices para melhorar performance
        await queryRunner.query(`
            CREATE INDEX "idx_proposals_cliente" ON "proposals"("cliente_id");
            CREATE INDEX "idx_proposals_prestador" ON "proposals"("prestador_id");
            CREATE INDEX "idx_proposals_servico" ON "proposals"("servico_id");
            CREATE INDEX "idx_proposals_status" ON "proposals"("status");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_proposals_status"`);
        await queryRunner.query(`DROP INDEX "idx_proposals_servico"`);
        await queryRunner.query(`DROP INDEX "idx_proposals_prestador"`);
        await queryRunner.query(`DROP INDEX "idx_proposals_cliente"`);
        await queryRunner.query(`DROP TABLE "proposal_history"`);
        await queryRunner.query(`DROP TABLE "proposals"`);
        await queryRunner.query(`DROP TYPE "public"."proposal_status_enum"`);
    }
} 