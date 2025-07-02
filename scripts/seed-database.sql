-- Inserir dados de exemplo para testar o sistema

-- Inserir empresa exemplo
INSERT INTO empresas (nome, slogan, telefone, whatsapp, email, endereco) VALUES
('Salão Exemplo', 'Beleza e bem-estar', '(11) 99999-9999', '(11) 99999-9999', 'contato@salaoexemplo.com', 'Rua das Flores, 123 - Centro');

-- Inserir horários de funcionamento (segunda a sábado: 8h-18h)
INSERT INTO horarios_funcionamento (empresa_id, dia_semana, hora_inicio, hora_fim, ativo) VALUES
(1, 1, '08:00', '18:00', true), -- Segunda
(1, 2, '08:00', '18:00', true), -- Terça
(1, 3, '08:00', '18:00', true), -- Quarta
(1, 4, '08:00', '18:00', true), -- Quinta
(1, 5, '08:00', '18:00', true), -- Sexta
(1, 6, '08:00', '18:00', true), -- Sábado
(1, 0, '08:00', '18:00', false); -- Domingo (fechado)

-- Inserir usuário administrador (senha: admin123)
INSERT INTO usuarios (empresa_id, nome, email, senha_hash, tipo_usuario) VALUES
(1, 'Administrador', 'admin@salaoexemplo.com', '$2b$10$example_hash', 'admin');

-- Inserir atendentes
INSERT INTO atendentes (empresa_id, nome, especialidades, cor_agenda) VALUES
(1, 'Maria Silva', ARRAY['Corte Feminino', 'Coloração', 'Escova'], '#ec4899'),
(1, 'Ana Costa', ARRAY['Corte Feminino', 'Corte Masculino', 'Penteados'], '#8b5cf6'),
(1, 'Julia Santos', ARRAY['Manicure', 'Pedicure', 'Esmaltação'], '#10b981');

-- Inserir horários dos atendentes (todos trabalham de segunda a sábado)
INSERT INTO horarios_atendentes (atendente_id, dia_semana, hora_inicio, hora_fim) VALUES
-- Maria Silva
(1, 1, '08:00', '18:00'), (1, 2, '08:00', '18:00'), (1, 3, '08:00', '18:00'),
(1, 4, '08:00', '18:00'), (1, 5, '08:00', '18:00'), (1, 6, '08:00', '18:00'),
-- Ana Costa
(2, 1, '08:00', '18:00'), (2, 2, '08:00', '18:00'), (2, 3, '08:00', '18:00'),
(2, 4, '08:00', '18:00'), (2, 5, '08:00', '18:00'), (2, 6, '08:00', '18:00'),
-- Julia Santos
(3, 1, '08:00', '18:00'), (3, 2, '08:00', '18:00'), (3, 3, '08:00', '18:00'),
(3, 4, '08:00', '18:00'), (3, 5, '08:00', '18:00'), (3, 6, '08:00', '18:00');

-- Inserir serviços
INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, cor) VALUES
(1, 'Corte Feminino', 'Corte personalizado para cabelos femininos', 45.00, 45, '#ec4899'),
(1, 'Corte Masculino', 'Corte tradicional e moderno para homens', 25.00, 30, '#3b82f6'),
(1, 'Coloração', 'Coloração completa com produtos de qualidade', 120.00, 120, '#f59e0b'),
(1, 'Escova', 'Escova modeladora para todos os tipos de cabelo', 35.00, 40, '#8b5cf6'),
(1, 'Hidratação', 'Tratamento hidratante profundo', 60.00, 60, '#10b981'),
(1, 'Manicure', 'Cuidados completos para as unhas das mãos', 20.00, 30, '#ef4444'),
(1, 'Pedicure', 'Cuidados completos para os pés', 25.00, 45, '#06b6d4'),
(1, 'Penteado', 'Penteados para eventos especiais', 80.00, 60, '#d946ef');

-- Inserir alguns clientes exemplo
INSERT INTO clientes (empresa_id, nome, telefone, email) VALUES
(1, 'Maria Silva', '(11) 98888-8888', 'maria@email.com'),
(1, 'João Santos', '(11) 97777-7777', 'joao@email.com'),
(1, 'Carla Oliveira', '(11) 96666-6666', 'carla@email.com'),
(1, 'Pedro Lima', '(11) 95555-5555', 'pedro@email.com'),
(1, 'Ana Souza', '(11) 94444-4444', 'ana@email.com');

-- Inserir alguns agendamentos exemplo para hoje
INSERT INTO agendamentos (empresa_id, cliente_id, atendente_id, servico_id, data_agendamento, hora_inicio, hora_fim, status, valor, token_cancelamento) VALUES
(1, 1, 2, 1, CURRENT_DATE, '09:00', '09:45', 'confirmado', 45.00, 'token_001'),
(1, 2, 1, 2, CURRENT_DATE, '10:30', '11:00', 'confirmado', 25.00, 'token_002'),
(1, 3, 2, 3, CURRENT_DATE, '14:00', '16:00', 'agendado', 120.00, 'token_003'),
(1, 4, 1, 2, CURRENT_DATE, '15:30', '16:00', 'confirmado', 25.00, 'token_004');

-- Inserir algumas movimentações financeiras
INSERT INTO movimentacoes_financeiras (empresa_id, agendamento_id, atendente_id, tipo, categoria, descricao, valor, data_movimentacao) VALUES
(1, 1, 2, 'entrada', 'Serviço', 'Corte Feminino - Maria Silva', 45.00, CURRENT_DATE),
(1, 2, 1, 'entrada', 'Serviço', 'Corte Masculino - João Santos', 25.00, CURRENT_DATE),
(1, NULL, NULL, 'saida', 'Produto', 'Compra de shampoos', 150.00, CURRENT_DATE),
(1, NULL, NULL, 'saida', 'Fixo', 'Aluguel do salão', 1200.00, CURRENT_DATE - INTERVAL '1 day');
