-- Inserir empresa exemplo
INSERT INTO empresas (nome, slogan, telefone, whatsapp, email, endereco) VALUES
('Salão Exemplo', 'Beleza e bem-estar', '(11) 99999-9999', '(11) 99999-9999', 'contato@salaoexemplo.com', 'Rua das Flores, 123 - Centro')
ON CONFLICT DO NOTHING;

-- Inserir horários de funcionamento (segunda a sábado: 8h-18h)
INSERT INTO horarios_funcionamento (empresa_id, dia_semana, hora_inicio, hora_fim, ativo) VALUES
(1, 1, '08:00', '18:00', true), -- Segunda
(1, 2, '08:00', '18:00', true), -- Terça
(1, 3, '08:00', '18:00', true), -- Quarta
(1, 4, '08:00', '18:00', true), -- Quinta
(1, 5, '08:00', '18:00', true), -- Sexta
(1, 6, '08:00', '18:00', true), -- Sábado
(1, 0, '08:00', '18:00', false) -- Domingo (fechado)
ON CONFLICT DO NOTHING;

-- Inserir atendentes
INSERT INTO atendentes (empresa_id, nome, especialidades, cor_agenda) VALUES
(1, 'Maria Silva', ARRAY['Corte Feminino', 'Coloração', 'Escova'], '#ec4899'),
(1, 'Ana Costa', ARRAY['Corte Feminino', 'Corte Masculino', 'Penteados'], '#8b5cf6'),
(1, 'Julia Santos', ARRAY['Manicure', 'Pedicure'], '#10b981')
ON CONFLICT DO NOTHING;

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
(3, 4, '08:00', '18:00'), (3, 5, '08:00', '18:00'), (3, 6, '08:00', '18:00')
ON CONFLICT DO NOTHING;

-- Inserir serviços
INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, cor) VALUES
(1, 'Corte Feminino', 'Corte personalizado para cabelos femininos', 45.00, 45, '#ec4899'),
(1, 'Corte Masculino', 'Corte tradicional e moderno para homens', 25.00, 30, '#3b82f6'),
(1, 'Coloração', 'Coloração completa com produtos de qualidade', 120.00, 120, '#f59e0b'),
(1, 'Escova', 'Escova modeladora para todos os tipos de cabelo', 35.00, 40, '#8b5cf6'),
(1, 'Hidratação', 'Tratamento hidratante profundo', 60.00, 60, '#10b981'),
(1, 'Manicure', 'Cuidados completos para as unhas das mãos', 20.00, 30, '#ef4444'),
(1, 'Pedicure', 'Cuidados completos para os pés', 25.00, 45, '#06b6d4'),
(1, 'Penteado', 'Penteados para eventos especiais', 80.00, 60, '#d946ef')
ON CONFLICT DO NOTHING;
