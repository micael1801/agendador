-- Limpar dados existentes
TRUNCATE TABLE movimentacoes_financeiras, agendamentos, bloqueios, clientes, servicos, horarios_atendentes, atendentes, usuarios, horarios_funcionamento, empresas RESTART IDENTITY CASCADE;

-- Inserir empresa
INSERT INTO empresas (nome, slogan, telefone, whatsapp, email, endereco, cor_principal, cor_secundaria) VALUES
('Salão Exemplo', 'Beleza e bem-estar em primeiro lugar', '(11) 3333-4444', '(11) 99999-8888', 'contato@salaoexemplo.com', 'Rua das Flores, 123 - Centro', '#ec4899', '#9333ea');

-- Inserir horários de funcionamento (Segunda a Sábado)
INSERT INTO horarios_funcionamento (empresa_id, dia_semana, hora_inicio, hora_fim, ativo) VALUES
(1, 1, '08:00', '18:00', true), -- Segunda
(1, 2, '08:00', '18:00', true), -- Terça
(1, 3, '08:00', '18:00', true), -- Quarta
(1, 4, '08:00', '18:00', true), -- Quinta
(1, 5, '08:00', '18:00', true), -- Sexta
(1, 6, '08:00', '16:00', true); -- Sábado

-- Inserir usuários (admin e atendentes)
INSERT INTO usuarios (empresa_id, nome, email, senha_hash, tipo_usuario, ativo) VALUES
(1, 'Administrador', 'admin@salaoexemplo.com', '$2b$10$hash_exemplo', 'admin', true),
(1, 'Maria Silva', 'maria@salaoexemplo.com', '$2b$10$hash_exemplo', 'atendente', true),
(1, 'Ana Costa', 'ana@salaoexemplo.com', '$2b$10$hash_exemplo', 'atendente', true),
(1, 'Julia Santos', 'julia@salaoexemplo.com', '$2b$10$hash_exemplo', 'atendente', true);

-- Inserir atendentes
INSERT INTO atendentes (usuario_id, empresa_id, nome, especialidades, cor_agenda, ativo) VALUES
(2, 1, 'Maria Silva', ARRAY['Corte Feminino', 'Coloração', 'Escova', 'Hidratação'], '#ec4899', true),
(3, 1, 'Ana Costa', ARRAY['Corte Feminino', 'Corte Masculino', 'Escova'], '#8b5cf6', true),
(4, 1, 'Julia Santos', ARRAY['Manicure', 'Pedicure'], '#10b981', true);

-- Inserir horários dos atendentes (Segunda a Sábado)
INSERT INTO horarios_atendentes (atendente_id, dia_semana, hora_inicio, hora_fim, ativo) VALUES
-- Maria Silva
(1, 1, '08:00', '17:00', true), -- Segunda
(1, 2, '08:00', '17:00', true), -- Terça
(1, 3, '08:00', '17:00', true), -- Quarta
(1, 4, '08:00', '17:00', true), -- Quinta
(1, 5, '08:00', '17:00', true), -- Sexta
(1, 6, '08:00', '15:00', true), -- Sábado

-- Ana Costa
(2, 1, '09:00', '18:00', true), -- Segunda
(2, 2, '09:00', '18:00', true), -- Terça
(2, 3, '09:00', '18:00', true), -- Quarta
(2, 4, '09:00', '18:00', true), -- Quinta
(2, 5, '09:00', '18:00', true), -- Sexta
(2, 6, '09:00', '16:00', true), -- Sábado

-- Julia Santos
(3, 2, '08:00', '17:00', true), -- Terça
(3, 3, '08:00', '17:00', true), -- Quarta
(3, 4, '08:00', '17:00', true), -- Quinta
(3, 5, '08:00', '17:00', true), -- Sexta
(3, 6, '08:00', '15:00', true); -- Sábado

-- Inserir serviços
INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, cor, ativo) VALUES
(1, 'Corte Feminino', 'Corte personalizado para cabelos femininos', 45.00, 45, '#ec4899', true),
(1, 'Corte Masculino', 'Corte tradicional masculino', 25.00, 30, '#3b82f6', true),
(1, 'Coloração', 'Coloração completa dos cabelos', 120.00, 120, '#f59e0b', true),
(1, 'Escova', 'Escova modeladora', 35.00, 40, '#10b981', true),
(1, 'Hidratação', 'Tratamento hidratante para cabelos', 60.00, 60, '#8b5cf6', true),
(1, 'Manicure', 'Cuidados completos para as unhas das mãos', 20.00, 30, '#ef4444', true),
(1, 'Pedicure', 'Cuidados completos para as unhas dos pés', 25.00, 45, '#06b6d4', true);

-- Inserir alguns clientes de exemplo
INSERT INTO clientes (empresa_id, nome, telefone, email) VALUES
(1, 'Cliente Exemplo 1', '(11) 99999-1111', 'cliente1@email.com'),
(1, 'Cliente Exemplo 2', '(11) 99999-2222', 'cliente2@email.com');

-- Inserir alguns agendamentos de exemplo (para testar conflitos)
INSERT INTO agendamentos (empresa_id, cliente_id, atendente_id, servico_id, data_agendamento, hora_inicio, hora_fim, status, valor) VALUES
(1, 1, 1, 1, CURRENT_DATE + INTERVAL '1 day', '09:00', '09:45', 'agendado', 45.00),
(1, 2, 1, 3, CURRENT_DATE + INTERVAL '2 days', '14:00', '16:00', 'agendado', 120.00);
