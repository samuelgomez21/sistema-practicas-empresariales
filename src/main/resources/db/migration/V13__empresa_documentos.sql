CREATE TABLE empresa_documentos (
                                    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    empresa_id    BIGINT       NOT NULL,
                                    tipo          VARCHAR(50)  NOT NULL COMMENT 'CAMARA_COMERCIO | NIT | CEDULA_RL | CONVENIO',
                                    url           VARCHAR(500) NOT NULL,
                                    nombre_archivo VARCHAR(200),
                                    fecha_vigencia DATE         NULL COMMENT 'Solo para cámara de comercio y convenio',
                                    fecha_carga   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    activo        BOOLEAN      NOT NULL DEFAULT TRUE,
                                    CONSTRAINT fk_emp_doc_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);