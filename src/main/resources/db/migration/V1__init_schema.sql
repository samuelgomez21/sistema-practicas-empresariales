CREATE TABLE facultades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE programas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    facultad_id BIGINT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_programa_facultad FOREIGN KEY (facultad_id) REFERENCES facultades(id),
    CONSTRAINT uq_programa_nombre_facultad UNIQUE (nombre, facultad_id)
);

CREATE TABLE programa_parametros (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    programa_id BIGINT NOT NULL UNIQUE,
    num_practicas INT NOT NULL DEFAULT 4,
    cortes_por_practica INT NOT NULL DEFAULT 3,
    nota_minima_aprobacion DECIMAL(3,2) NOT NULL DEFAULT 3.0,
    max_asignaciones_simultaneas INT NOT NULL DEFAULT 1,
    umbral_inactividad_dias INT NOT NULL DEFAULT 5,
    CONSTRAINT fk_parametro_programa FOREIGN KEY (programa_id) REFERENCES programas(id)
);

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    rol_id BIGINT NOT NULL,
    scope_tipo VARCHAR(50) NOT NULL DEFAULT 'GLOBAL',
    scope_valor_id VARCHAR(100) NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE bitacora_auditoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_email VARCHAR(100) NOT NULL,
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    detalles TEXT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NULL
);

-- Insertar roles iniciales obligatorios
INSERT INTO roles (nombre) VALUES ('ADMINISTRADOR');
INSERT INTO roles (nombre) VALUES ('DIRECCION');
INSERT INTO roles (nombre) VALUES ('COORDINACION_ACADEMICA');
INSERT INTO roles (nombre) VALUES ('COORDINADOR_PRACTICA');
INSERT INTO roles (nombre) VALUES ('SECRETARIA');
INSERT INTO roles (nombre) VALUES ('DOCENTE_ASESOR');
INSERT INTO roles (nombre) VALUES ('EMPRESA_VINCULADA');
INSERT INTO roles (nombre) VALUES ('TUTOR_EMPRESARIAL');
INSERT INTO roles (nombre) VALUES ('ESTUDIANTE');
