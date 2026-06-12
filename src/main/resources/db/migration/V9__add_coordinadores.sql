
-- Relación N:M entre coordinadores académicos y programas que gestionan
CREATE TABLE coordinador_programas (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id   BIGINT NOT NULL,
    programa_id  BIGINT NOT NULL,
    CONSTRAINT fk_coordprog_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_coordprog_programa
        FOREIGN KEY (programa_id) REFERENCES programas(id),
    CONSTRAINT uq_coordinador_programa
        UNIQUE (usuario_id, programa_id)
);