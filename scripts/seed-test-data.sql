-- Inserir empresa de exemplo
INSERT INTO empresas (id, nome, slogan, telefone, whatsapp, email, cor_principal, cor_secundaria) 
VALUES (1, 'Salão Exemplo', 'Beleza e bem-estar em primeiro lugar', '(11) 99999-9999', '(11) 99999-9999', 'contato@salaoexemplo.com', '#ec4899', '#9333ea')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  slogan = EXCLUDED.slogan,
  telefone = EXCLUDED.telefone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email;

-- Inserir serviços
INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao_minutos, cor, ativo) VALUES
(1, 'Corte Feminino', 'Corte personalizado para mulheres', 45.00, 45, '#ec4899', true),
(1, 'Corte Masculino', 'Corte tradicional masculino', 25.00, 30, '#3b82f6', true),
(1, 'Coloração', 'Coloração completa dos cabelos', 120.00, 120, '#8b5cf6', true),
(1, 'Escova', 'Escova modeladora', 35.00, 40, '#10b981', true),
(1, 'Hidratação', 'Tratamento hidratante para cabelos', 60.00, 60, '#f59e0b', true),
(1, 'Manicure', 'Cuidados para as unhas das mãos', 20.00, 30, '#ef4444', true)
ON CONFLICT DO NOTHING;

-- Inserir atendentes
INSERT INTO atendentes (empresa_id, nome, especialidades, cor_agenda, ativo) VALUES
(1, 'Maria Silva', ARRAY['Corte Feminino', 'Coloração', 'Escova', 'Hidratação'], '#ec4899', true),
(1, 'Ana Costa', ARRAY['Corte Feminino', 'Corte Masculino', 'Escova'], '#8b5cf6', true),
(1, 'Julia Santos', ARRAY['Manicure'], '#10b981', true),
(1, 'Carlos Oliveira', ARRAY['Corte Masculino'], '#3b82f6', true)
ON CONFLICT DO NOTHING;

-- Inserir horários de funcionamento (Segunda a Sábado, 8h às 18h)
INSERT INTO horarios_funcionamento (empresa_id, dia_semana, hora_inicio, hora_fim, ativo) VALUES
(1, 1, '08:00', '18:00', true), -- Segunda
(1, 2, '08:00', '18:00', true), -- Terça
(1, 3, '08:00', '18:00', true), -- Quarta
(1, 4, '08:00', '18:00', true), -- Quinta
(1, 5, '08:00', '18:00', true), -- Sexta
(1, 6, '08:00', '16:00', true)  -- Sábado
ON CONFLICT DO NOTHING;

-- Inserir horários dos atendentes (todos trabalham de segunda a sábado)
INSERT INTO horarios_atendentes (atendente_id, dia_semana, hora_inicio, hora_fim, ativo) 
SELECT a.id, d.dia, '08:00', CASE WHEN d.dia = 6 THEN '16:00' ELSE '18:00' END, true
FROM atendentes a
CROSS JOIN (VALUES (1), (2), (3), (4), (5), (6)) AS d(dia)
WHERE a.empresa_id = 1
ON CONFLICT DO NOTHING;
