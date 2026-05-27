CREATE TABLE catalogo_practicas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_practica INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    materia_nucleo VARCHAR(100) NOT NULL,
    materia_nucleo_codigo VARCHAR(20) NOT NULL,
    programa_id BIGINT NOT NULL,
    cortes_por_practica INT NOT NULL DEFAULT 3,
    duracion_semanas INT NOT NULL DEFAULT 16,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    documentos_requeridos VARCHAR(255) NOT NULL DEFAULT 'HOJA_DE_VIDA,PAZ_Y_SALVO',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_catalogo_programa FOREIGN KEY (programa_id) REFERENCES programas(id),
    CONSTRAINT uq_catalogo_practica_num_programa UNIQUE (numero_practica, programa_id)
);

CREATE TABLE programa_requisitos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    programa_id BIGINT NOT NULL,
    numero_practica INT NOT NULL,
    creditos_minimos INT NOT NULL,
    promedio_minimo DECIMAL(3,2) NOT NULL,
    requiere_practica_anterior BOOLEAN NOT NULL DEFAULT TRUE,
    documentos_requeridos VARCHAR(255) NOT NULL DEFAULT 'HOJA_DE_VIDA,PAZ_Y_SALVO',
    CONSTRAINT fk_requisito_programa FOREIGN KEY (programa_id) REFERENCES programas(id),
    CONSTRAINT uq_requisito_programa_num UNIQUE (programa_id, numero_practica)
);

CREATE TABLE estudiantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    identificacion VARCHAR(50) NOT NULL UNIQUE,
    telefono VARCHAR(20) NULL,
    contacto_emergencia VARCHAR(100) NULL,
    programa_id BIGINT NOT NULL,
    semestre INT NOT NULL,
    creditos_aprobados INT NOT NULL,
    promedio_acumulado DECIMAL(3,2) NOT NULL,
    estado_aptitud VARCHAR(50) NOT NULL DEFAULT 'SIN_EVALUAR',
    estado_practica VARCHAR(50) NOT NULL DEFAULT 'SIN_INICIAR',
    documento_hoja_vida_url VARCHAR(255) NULL,
    documento_paz_salvo_url VARCHAR(255) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_estudiante_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_estudiante_programa FOREIGN KEY (programa_id) REFERENCES programas(id)
);

CREATE TABLE empresas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nit VARCHAR(50) NOT NULL UNIQUE,
    razon_social VARCHAR(150) NOT NULL,
    sector_economico VARCHAR(100) NULL,
    direccion VARCHAR(150) NULL,
    municipio VARCHAR(100) NULL,
    telefono VARCHAR(20) NULL,
    contacto_principal_nombre VARCHAR(100) NULL,
    contacto_principal_email VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE tutores_empresariales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) NULL,
    empresa_id BIGINT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tutor_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_tutor_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

CREATE TABLE instancias_practica (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id BIGINT NOT NULL,
    numero_practica INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    materia_nucleo VARCHAR(100) NOT NULL,
    materia_nucleo_codigo VARCHAR(20) NOT NULL,
    duracion_semanas INT NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'ASIGNADA_PENDIENTE_INICIO',
    empresa_id BIGINT NULL,
    docente_asesor_id BIGINT NULL,
    tutor_empresarial_id BIGINT NULL,
    nota_final DECIMAL(3,2) NULL,
    resultado VARCHAR(20) NULL,
    fecha_inicio DATE NULL,
    fecha_fin DATE NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_instancia_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
    CONSTRAINT fk_instancia_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    CONSTRAINT fk_instancia_docente FOREIGN KEY (docente_asesor_id) REFERENCES usuarios(id),
    CONSTRAINT fk_instancia_tutor FOREIGN KEY (tutor_empresarial_id) REFERENCES tutores_empresariales(id)
);

CREATE TABLE practica_documentos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    practica_id BIGINT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    url VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    fecha_carga TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cargado_por_email VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT fk_documento_practica FOREIGN KEY (practica_id) REFERENCES instancias_practica(id)
);
