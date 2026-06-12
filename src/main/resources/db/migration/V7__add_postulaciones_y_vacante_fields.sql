-- Agregar campos faltantes a vacantes
ALTER TABLE vacantes
    ADD COLUMN habilidades    VARCHAR(255) NULL,
    ADD COLUMN semestre_minimo INT         NULL;

-- Tabla de postulaciones (asignaciones de estudiantes a vacantes)
CREATE TABLE postulaciones (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    vacante_id      BIGINT NOT NULL,
    estudiante_id   BIGINT NOT NULL,
    estado          VARCHAR(30) NOT NULL DEFAULT 'POSTULADO',
    fecha_postulacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones   TEXT,
    CONSTRAINT fk_postulacion_vacante
        FOREIGN KEY (vacante_id) REFERENCES vacantes(id),
    CONSTRAINT fk_postulacion_estudiante
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
    CONSTRAINT uq_postulacion
        UNIQUE (vacante_id, estudiante_id)
);

-- Tabla de historial de carga docente
CREATE TABLE historial_carga_docente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    docente_id BIGINT NOT NULL,
    practica_id BIGINT NOT NULL,
    fecha_asignacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
    CONSTRAINT fk_historial_docente FOREIGN KEY (docente_id) REFERENCES usuarios(id),
    CONSTRAINT fk_historial_practica FOREIGN KEY (practica_id) REFERENCES instancias_practica(id)
);
