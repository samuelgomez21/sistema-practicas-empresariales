
-- Módulo de visitas a empresas por docentes y coordinadores

CREATE TABLE visitas_empresa (
                                 id                  BIGINT          NOT NULL AUTO_INCREMENT,
                                 empresa_id          BIGINT          NOT NULL,
                                 registrado_por_id   BIGINT          NOT NULL,
                                 tipo_visitante      VARCHAR(30)     NOT NULL DEFAULT 'COORDINADOR',
                                 fecha               DATE            NOT NULL,
                                 hora_inicio         TIME            NULL,
                                 hora_fin            TIME            NULL,
                                 motivo              VARCHAR(200)    NOT NULL,
                                 observaciones       TEXT            NULL,
                                 activo              TINYINT(1)      NOT NULL DEFAULT 1,
                                 created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                 PRIMARY KEY (id),
                                 CONSTRAINT fk_visita_empresa
                                     FOREIGN KEY (empresa_id)
                                         REFERENCES empresas (id)
                                         ON DELETE RESTRICT,
                                 CONSTRAINT fk_visita_usuario
                                     FOREIGN KEY (registrado_por_id)
                                         REFERENCES usuarios (id)
                                         ON DELETE RESTRICT,
                                 CONSTRAINT chk_visita_tipo
                                     CHECK (tipo_visitante IN ('DOCENTE_ASESOR', 'COORDINADOR')),
                                 INDEX idx_visita_empresa   (empresa_id),
                                 INDEX idx_visita_usuario   (registrado_por_id),
                                 INDEX idx_visita_fecha     (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;