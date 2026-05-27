CREATE TABLE vacantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empresa_id BIGINT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    perfil_requerido TEXT NOT NULL,
    requisitos TEXT,
    cupos_totales INT NOT NULL,
    cupos_disponibles INT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    motivo_rechazo TEXT,
    fecha_creacion DATETIME NOT NULL,
    CONSTRAINT fk_vacante_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id)
);
