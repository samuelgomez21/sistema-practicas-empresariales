CREATE TABLE contratos (
                           id                BIGINT AUTO_INCREMENT PRIMARY KEY,
                           practica_id       BIGINT         NOT NULL,
                           estudiante_id     BIGINT         NOT NULL,
                           empresa_id        BIGINT         NOT NULL,
                           estudiante_nombre VARCHAR(150)   NOT NULL,
                           empresa_nombre    VARCHAR(150)   NOT NULL,
                           tipo_contrato     VARCHAR(100),
                           fecha_inicio      DATE,
                           fecha_fin         DATE,
                           valor_mensual     DECIMAL(12,2),
                           pdf_url           VARCHAR(500),
                           estado            VARCHAR(20)    NOT NULL DEFAULT 'GENERADO',
                           fecha_generacion  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           activo            BOOLEAN        NOT NULL DEFAULT TRUE
);