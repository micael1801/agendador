-- Limpar dados existentes (cuidado em produção!)
TRUNCATE TABLE movimentacoes_financeiras, agendamentos, bloqueios, clientes, servicos, horarios_atendentes, atendentes, usuarios, horarios_funcionamento, empresas RESTART IDENTITY CASCADE;

-- Inserir empresa
INSERT INTO empresas (nome, slogan, telefone, whatsapp, email, cor_principal, cor_secundaria) VALUES
('Salão Exemplo', 'Beleza e bem-estar em primeiro lugar', '(11) 3333-4444', '(11) 99999-8888', 'contato@salaoexemplo.com', '#ec4899', '#9333ea');

-- Inserir horários de funcionamento (segunda a sábado)
INSERT INTO horarios_funcionamento (empresa_id, dia_semana, hora_inicio, hora_fim, ativo) VALUES
(1, 1, '08:00', '18:00', true), -- Segunda
(1, 2, '08:00', '18:00', true), -- Terça
(1, 3, '08:00', '18:00', true), -- Quarta
(1, 4, '08:00', '18:00', true), -- Quinta
(1, 5, '08:00', '18:00', true), -- Sexta
(1, 6, '08:00', '17:00', true); -- Sábado

-- Inserir usuários
INSERT INTO usuarios (empresa_id, nome, email, senha_hash, tipo_usuario, ativo) VALUES
(1, 'Admin Sistema', 'admin@salaoexemplo.com', '$2b$10$hash_exemplo', 'admin', true),
(1, 'Maria Silva', 'maria@salaoexemplo.com', '$2b$10$hash_exemplo', 'atendente', true),
(1, 'Ana Costa', 'ana@salaoexemplo.com', '$2b$10$hash_exemplo', 'atendente', true),
(1, 'Julia Santos', 'julia@salaoexemplo.com', '$2b$10$hash_exemplo', 'atendente', true);

-- Inserir atendentes
INSERT INTO atendentes (usuario_id, empresa_id, nome, especialidades, cor_agenda, ativo) VALUES
(2, 1, 'Maria Silva', ARRAY['Corte Feminino', 'Coloração', 'Escova', 'Hidratação'], '#ec4899', true),
(3, 1, 'Ana Costa', ARRAY['Corte Feminino', 'Corte Masculino', 'Penteados', 'Escova'], '#8b5cf6', true),
(4, 1, 'Julia Santos', ARRAY['Manicure', 'Pedicure', 'Unhas Decoradas'], '#10b981', true);

-- Inserir horários dos atendentes (todos trabalham de segunda a sábado)
INSERT INTO horarios_atendentes (atendente_id, dia_semana, hora_inicio, hora_fim, ativo) VALUES
-- Maria Silva
(1, 1, '08:00', '18:00', true), (1, 2, '08:00', '18:00', true), (1, 3, '08:00', '18:00', true),
(1, 4, '08:00', '18:00', true), (1, 5, '08:00', '18:00', true), (1, 6, '08:00', '17:00', true),
-- Ana Costa
(2, 1, '08:00', '18:00', true), (2, 2, '08:00', '18:00', true), (2, 3, '08:00', '18:00', true),
(2, 4, '08:00', '18:00', true), (2, 5, '08:00', '18:00', true), (2, 6, '08:00', '17:00', true),
-- Julia Santos
(3, 1, '09:00', '17:00', true), (3, 2, '09:00', '17:00', true), (3, 3, '09:00', '17:00', true),
(3, 4, '09:00', '17:00', true), (3, 5, '09:00', '17:00', true), (3, 6, '09:00', '16:00', true);

-- Inserir serviços
INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, cor, ativo) VALUES
(1, 'Corte Feminino', 'Corte personalizado de acordo com o formato do rosto', 45.00, 45, '#ec4899', true),
(1, 'Corte Masculino', 'Corte tradicional e moderno', 25.00, 30, '#3b82f6', true),
(1, 'Coloração', 'Coloração completa com produtos de qualidade', 120.00, 120, '#f59e0b', true),
(1, 'Escova', 'Escova modeladora para todos os tipos de cabelo', 35.00, 40, '#8b5cf6', true),
(1, 'Hidratação', 'Tratamento hidratante profundo', 60.00, 60, '#10b981', true),
(1, 'Manicure', 'Cuidados completos para as unhas das mãos', 20.00, 30, '#f97316', true),
(1, 'Pedicure', 'Cuidados completos para as unhas dos pés', 25.00, 45, '#06b6d4', true),
(1, 'Penteados', 'Penteados para eventos especiais', 80.00, 90, '#a855f7', true);

-- Inserir alguns clientes de exemplo
INSERT INTO clientes (empresa_id, nome, telefone, email) VALUES
(1, 'Ana Oliveira', '(11) 99999-1111', 'ana.oliveira@email.com'),
(1, 'Carlos Silva', '(11) 99999-2222', 'carlos.silva@email.com'),
(1, 'Mariana Santos', '(11) 99999-3333', 'mariana.santos@email.com');

-- Inserir alguns agendamentos de exemplo para hoje e amanhã
INSERT INTO agendamentos (empresa_id, cliente_id, atendente_id, servico_id, data_agendamento, hora_inicio, hora_fim, status, valor, token_cancelamento) VALUES
(1, 1, 1, 1, CURRENT_DATE, '09:00', '09:45', 'agendado', 45.00, 'token-exemplo-1'),
(1, 2, 2, 2, CURRENT_DATE, '10:00', '10:30', 'agendado', 25.00, 'token-exemplo-2'),
(1, 3, 3, 6, CURRENT_DATE + INTERVAL '1 day', '14:00', '14:30', 'agendado', 20.00, 'token-exemplo-3');

-- Inserir movimentações financeiras correspondentes
INSERT INTO movimentacoes_financeiras (empresa_id, agendamento_id, atendente_id, tipo, categoria, descricao, valor, data_movimentacao) VALUES
(1, 1, 1, 'entrada', 'Serviço', 'Corte Feminino - Ana Oliveira', 45.00, CURRENT_DATE),
(1, 2, 2, 'entrada', 'Serviço', 'Corte Masculino - Carlos Silva', 25.00, CURRENT_DATE),
(1, 3, 3, 'entrada', 'Serviço', 'Manicure - Mariana Santos', 20.00, CURRENT_DATE + INTERVAL '1 day');

-- Verificar se os dados foram inseridos
SELECT 'Empresas' as tabela, COUNT(*) as total FROM empresas
UNION ALL
SELECT 'Usuários' as tabela, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'Atendentes' as tabela, COUNT(*) as total FROM atendentes
UNION ALL
SELECT 'Serviços' as tabela, COUNT(*) as total FROM servicos
UNION ALL
SELECT 'Clientes' as tabela, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'Agendamentos' as tabela, COUNT(*) as total FROM agendamentos;
