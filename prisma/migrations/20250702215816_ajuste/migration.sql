/*
  Warnings:

  - You are about to drop the column `data_agendamento` on the `agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `hora_fim` on the `agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `hora_inicio` on the `agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `token_cancelamento` on the `agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `cor` on the `servicos` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `bloqueios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `horarios_atendentes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `horarios_funcionamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `movimentacoes_financeiras` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clienteNome` to the `agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteTelefone` to the `agendamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_hora` to the `agendamentos` table without a default value. This is not possible if the table is not empty.
  - Made the column `usuario_id` on table `atendentes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "agendamentos" DROP CONSTRAINT "agendamentos_atendente_id_fkey";

-- DropForeignKey
ALTER TABLE "agendamentos" DROP CONSTRAINT "agendamentos_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "agendamentos" DROP CONSTRAINT "agendamentos_servico_id_fkey";

-- DropForeignKey
ALTER TABLE "atendentes" DROP CONSTRAINT "atendentes_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "bloqueios" DROP CONSTRAINT "bloqueios_atendente_id_fkey";

-- DropForeignKey
ALTER TABLE "bloqueios" DROP CONSTRAINT "bloqueios_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "clientes" DROP CONSTRAINT "clientes_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "horarios_atendentes" DROP CONSTRAINT "horarios_atendentes_atendente_id_fkey";

-- DropForeignKey
ALTER TABLE "horarios_funcionamento" DROP CONSTRAINT "horarios_funcionamento_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "movimentacoes_financeiras" DROP CONSTRAINT "movimentacoes_financeiras_agendamento_id_fkey";

-- DropForeignKey
ALTER TABLE "movimentacoes_financeiras" DROP CONSTRAINT "movimentacoes_financeiras_atendente_id_fkey";

-- DropForeignKey
ALTER TABLE "movimentacoes_financeiras" DROP CONSTRAINT "movimentacoes_financeiras_empresa_id_fkey";

-- DropIndex
DROP INDEX "agendamentos_token_cancelamento_key";

-- AlterTable
ALTER TABLE "agendamentos" DROP COLUMN "data_agendamento",
DROP COLUMN "hora_fim",
DROP COLUMN "hora_inicio",
DROP COLUMN "observacoes",
DROP COLUMN "token_cancelamento",
DROP COLUMN "valor",
ADD COLUMN     "clienteEmail" TEXT,
ADD COLUMN     "clienteNome" TEXT NOT NULL,
ADD COLUMN     "clienteObs" TEXT,
ADD COLUMN     "clienteTelefone" TEXT NOT NULL,
ADD COLUMN     "data_hora" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'CONFIRMADO';

-- AlterTable
ALTER TABLE "atendentes" ALTER COLUMN "usuario_id" SET NOT NULL,
ALTER COLUMN "cor_agenda" DROP DEFAULT;

-- AlterTable
ALTER TABLE "servicos" DROP COLUMN "cor",
ALTER COLUMN "empresa_id" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "ativo";

-- DropTable
DROP TABLE "bloqueios";

-- DropTable
DROP TABLE "clientes";

-- DropTable
DROP TABLE "horarios_atendentes";

-- DropTable
DROP TABLE "horarios_funcionamento";

-- DropTable
DROP TABLE "movimentacoes_financeiras";

-- AddForeignKey
ALTER TABLE "atendentes" ADD CONSTRAINT "atendentes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_atendente_id_fkey" FOREIGN KEY ("atendente_id") REFERENCES "atendentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
