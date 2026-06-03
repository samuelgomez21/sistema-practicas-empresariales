-- Agregar columnas a instancias_practica
ALTER TABLE instancias_practica
    ADD COLUMN catalogo_practica_id BIGINT NULL;

ALTER TABLE instancias_practica
    ADD COLUMN fecha_sustentacion DATE NULL;

ALTER TABLE instancias_practica
    ADD CONSTRAINT fk_instancia_catalogo
        FOREIGN KEY (catalogo_practica_id)
            REFERENCES catalogo_practicas(id);

-- Tipos de documento
CREATE TABLE tipos_documento (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo         VARCHAR(50)  NOT NULL UNIQUE,
    nombre         VARCHAR(100) NOT NULL,
    obligatorio    BOOLEAN      NOT NULL DEFAULT TRUE,
    activo         BOOLEAN      NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Avances del estudiante
CREATE TABLE avances (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    practica_id         BIGINT       NOT NULL,
    titulo              VARCHAR(200) NOT NULL,
    descripcion         TEXT,
    archivo_url         VARCHAR(500),
    archivo_fecha_carga DATETIME,
    comentario_docente  TEXT,
    estado              ENUM('PENDIENTE','EN_REVISION','REVISADO')
                        NOT NULL DEFAULT 'PENDIENTE',
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                         ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_avance_practica
        FOREIGN KEY (practica_id) REFERENCES instancias_practica(id),

);

-- Checklist paz y salvo
CREATE TABLE checklist_paz_salvo (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    practica_id BIGINT       NOT NULL,
    clave       VARCHAR(50)  NOT NULL,
    label       VARCHAR(200) NOT NULL,
    completado  BOOLEAN      NOT NULL DEFAULT FALSE,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_checklist_practica
        FOREIGN KEY (practica_id) REFERENCES instancias_practica(id),
    CONSTRAINT uq_checklist_item
        UNIQUE (practica_id, clave)
);

-- Datos iniciales de tipos de documento
INSERT INTO tipos_documento (codigo, nombre, obligatorio) VALUES
    ('ARL',               'Afiliación ARL',                    TRUE),
    ('PLANEADOR',         'Planeador de práctica',             TRUE),
    ('INFORME_EJECUTIVO', 'Informe ejecutivo',                 TRUE),
    ('PRESENTACION',      'Presentación de sustentación',      TRUE),
    ('DOCUMENTO_FINAL',   'Documento final de práctica',       TRUE);