CREATE TABLE practica_evaluaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    practica_id BIGINT NOT NULL UNIQUE,
    nota_docente DECIMAL(3,2) NULL,
    observaciones_docente TEXT NULL,
    fecha_evaluacion_docente DATETIME NULL,
    nota_tutor DECIMAL(3,2) NULL,
    observaciones_tutor TEXT NULL,
    fecha_evaluacion_tutor DATETIME NULL,
    nota_final DECIMAL(3,2) NULL,
    observaciones_finales TEXT NULL,
    fecha_evaluacion_final DATETIME NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_evaluacion_practica FOREIGN KEY (practica_id) REFERENCES instancias_practica(id)
);

CREATE TABLE practica_encuestas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    practica_id BIGINT NOT NULL,
    tipo_actor VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    respuestas_json TEXT NULL,
    comentarios TEXT NULL,
    fecha_completada DATETIME NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_encuesta_practica FOREIGN KEY (practica_id) REFERENCES instancias_practica(id),
    CONSTRAINT uq_practica_actor UNIQUE (practica_id, tipo_actor)
);
