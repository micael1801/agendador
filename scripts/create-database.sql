-- Criação das tabelas principais do sistema de agendamento

-- Tabela de empresas/configurações
CREATE TABLE IF NOT EXISTS empresas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    slogan TEXT,
    logo_url TEXT,
    telefone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    endereco TEXT,
    cor_principal VARCHAR(7) DEFAULT '#ec4899',
    cor_secundaria VARCHAR(7) DEFAULT '#9333ea',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de horários de funcionamento
CREATE TABLE IF NOT EXISTS horarios_funcionamento (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    dia_semana INTEGER NOT NULL, -- 0=domingo, 1=segunda, etc
    hora_inicio TIME,
    hora_fim TIME,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuários (administradores e atendentes)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('admin', 'atendente')),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de atendentes/profissionais
CREATE TABLE IF NOT EXISTS atendentes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    empresa_id INTEGER REFERENCES empresas(id),
    nome VARCHAR(255) NOT NULL,
    especialidades TEXT[],
    cor_agenda VARCHAR(7) DEFAULT '#3b82f6',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de horários dos atendentes
CREATE TABLE IF NOT EXISTS horarios_atendentes (
    id SERIAL PRIMARY KEY,
    atendente_id INTEGER REFERENCES atendentes(id),
    dia_semana INTEGER NOT NULL,
    hora_inicio TIME,
    hora_fim TIME,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    duracao_minutos INTEGER NOT NULL,
    cor VARCHAR(7) DEFAULT '#10b981',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(255),
    data_nascimento DATE,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    cliente_id INTEGER REFERENCES clientes(id),
    atendente_id INTEGER REFERENCES atendentes(id),
    servico_id INTEGER REFERENCES servicos(id),
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'realizado', 'cancelado', 'faltou')),
    valor DECIMAL(10,2),
    observacoes TEXT,
    token_cancelamento VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de bloqueios (folgas, compromissos)
CREATE TABLE IF NOT EXISTS bloqueios (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    atendente_id INTEGER REFERENCES atendentes(id),
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    motivo VARCHAR(255),
    tipo VARCHAR(20) DEFAULT 'folga' CHECK (tipo IN ('folga', 'compromisso', 'manutencao')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de movimentações financeiras
CREATE TABLE IF NOT EXISTS movimentacoes_financeiras (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    agendamento_id INTEGER REFERENCES agendamentos(id),
    atendente_id INTEGER REFERENCES atendentes(id),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    categoria VARCHAR(100),
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    data_movimentacao DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_agendamento);
CREATE INDEX IF NOT EXISTS idx_agendamentos_atendente ON agendamentos(atendente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_clientes_empresa ON clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON movimentacoes_financeiras(data_movimentacao);
