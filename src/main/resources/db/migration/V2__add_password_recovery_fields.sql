ALTER TABLE usuarios
ADD COLUMN debe_cambiar_password BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN reset_password_token VARCHAR(255) NULL,
ADD COLUMN reset_password_expires TIMESTAMP NULL;
