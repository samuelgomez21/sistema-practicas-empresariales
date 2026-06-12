INSERT INTO roles (nombre) VALUES
                               ('COORDINADOR_PRACTICA'),
                               ('SECRETARIA_COORDINACION'),
                               ('COORDINADOR_ACADEMICO'),
                               ('TUTOR_EMPRESARIAL'),
    ON DUPLICATE KEY UPDATE nombre = nombre;