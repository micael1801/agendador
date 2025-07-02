-- Inserir empresa
INSERT INTO empresas (nome, slogan, telefone, whatsapp, email, endereco) VALUES
('Salão Exemplo', 'Beleza e bem-estar', '(11) 99999-9999', '(11) 99999-9999', 'contato@salaoexemplo.com', 'Rua das Flores, 123 - Centro');

-- Inserir serviços
INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, cor) VALUES
(1, 'Corte Feminino', 'Corte personalizado', 45.00, 45, '#ec4899'),
(1, 'Corte Masculino', 'Corte tradicional', 25.00, 30, '#3b82f6'),
(1, 'Coloração', 'Coloração completa', 120.00, 120, '#8b5cf6'),
(1, 'Escova', 'Escova modeladora', 35.00, 40, '#10b981'),
(1, 'Hidratação', 'Tratamento hidratante', 60.00, 60, '#06b6d4'),
(1, 'Manicure', 'Cuidados para as unhas', 20.00, 30, '#f59e0b');

-- Inserir usuários (senhas: 123456)
INSERT INTO usuarios (empresa_id, nome, email, senha_hash, tipo_usuario) VALUES
(1, 'Admin Sistema', 'admin@salao.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.LVtOy', 'admin'),
(1, 'Maria Silva', 'maria@salao.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.LVtOy', 'atendente'),
(1, 'Ana Costa', 'ana@salao.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.LVtOy', 'atendente'),
(1, 'Julia Santos', 'julia@salao.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.LVtOy', 'atendente');

-- Inserir atendentes
INSERT INTO atendentes (usuario_id, empresa_id, nome, especialidades, cor_agenda) VALUES
(2, 1, 'Maria Silva', ARRAY['Corte Feminino', 'Coloração', 'Escova'], '#ec4899'),
(3, 1, 'Ana Costa', ARRAY['Corte Feminino', 'Corte Masculino', 'Penteados'], '#8b5cf6'),
(4, 1, 'Julia Santos', ARRAY['Manicure', 'Pedicure'], '#10b981');

-- Inserir alguns clientes de exemplo
INSERT INTO clientes (empresa_id, nome, telefone, email) VALUES
(1, 'João Silva', '(11) 98888-8888', 'joao@email.com'),
(1, 'Maria Oliveira', '(11) 97777-7777', 'maria@email.com'),
(1, 'Pedro Santos', '(11) 96666-6666', 'pedro@email.com'),
(1, 'Ana Lima', '(11) 95555-5555', 'ana@email.com');

-- Inserir alguns agendamentos de exemplo para hoje e próximos dias
INSERT INTO agendamentos (empresa_id, cliente_id, atendente_id, servico_id, data_agendamento, hora_inicio, hora_fim, valor, status) VALUES
(1, 1, 1, 1, CURRENT_DATE, '09:00', '09:45', 45.00, 'confirmado'),
(1, 2, 2, 2, CURRENT_DATE, '10:00', '10:30', 25.00, 'agendado'),
(1, 3, 1, 3, CURRENT_DATE, '14:00', '16:00', 120.00, 'confirmado'),
(1, 4, 3, 6, CURRENT_DATE, '15:00', '15:30', 20.00, 'agendado'),
(1, 1, 2, 1, CURRENT_DATE + INTERVAL '1 day', '09:00', '09:45', 45.00, 'agendado'),
(1, 2, 1, 4, CURRENT_DATE + INTERVAL '1 day', '11:00', '11:40', 35.00, 'agendado'),
(1, 3, 3, 6, CURRENT_DATE + INTERVAL '2 days', '10:00', '10:30', 20.00, 'agendado');

-- Inserir horários de funcionamento
INSERT INTO horarios_funcionamento (empresa_id, dia_semana, hora_inicio, hora_fim) VALUES
(1, 1, '08:00', '18:00'), -- Segunda
(1, 2, '08:00', '18:00'), -- Terça
(1, 3, '08:00', '18:00'), -- Quarta
(1, 4, '08:00', '18:00'), -- Quinta
(1, 5, '08:00', '18:00'), -- Sexta
(1, 6, '08:00', '17:00'); -- Sábado
