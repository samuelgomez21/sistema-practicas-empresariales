-- ─────────────────────────────────────────────────────────────────
-- ENCUESTAS
-- ─────────────────────────────────────────────────────────────────

-- Plantilla de encuesta (configurable por el coordinador)
CREATE TABLE encuesta_plantilla (
id              BIGINT AUTO_INCREMENT PRIMARY KEY,
tipo            ENUM('ESTUDIANTE', 'TUTOR') NOT NULL,
version         VARCHAR(20) NOT NULL,
nombre          VARCHAR(150) NOT NULL,
activa          BOOLEAN NOT NULL DEFAULT TRUE,
fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT uq_encuesta_tipo_version UNIQUE (tipo, version)
);

-- Secciones de la encuesta
CREATE TABLE encuesta_seccion (
id          BIGINT AUTO_INCREMENT PRIMARY KEY,
plantilla_id BIGINT NOT NULL,
codigo      VARCHAR(10) NOT NULL,
titulo      VARCHAR(150) NOT NULL,
orden       INT NOT NULL,
CONSTRAINT fk_seccion_plantilla
    FOREIGN KEY (plantilla_id) REFERENCES encuesta_plantilla(id)
);

-- Preguntas de cada sección
CREATE TABLE encuesta_pregunta (
id          BIGINT AUTO_INCREMENT PRIMARY KEY,
seccion_id  BIGINT NOT NULL,
orden       INT NOT NULL,
texto       TEXT NOT NULL,
tipo        ENUM('ESCALA', 'TEXTO', 'BOOLEANO') NOT NULL DEFAULT 'ESCALA',
activa      BOOLEAN NOT NULL DEFAULT TRUE,
CONSTRAINT fk_pregunta_seccion
    FOREIGN KEY (seccion_id) REFERENCES encuesta_seccion(id)
);

-- Respuesta diligenciada de una encuesta
CREATE TABLE encuesta_respuesta (
id              BIGINT AUTO_INCREMENT PRIMARY KEY,
practica_id     BIGINT NOT NULL,
plantilla_id    BIGINT NOT NULL,
tipo            ENUM('ESTUDIANTE', 'TUTOR') NOT NULL,
respondido_por  VARCHAR(100) NOT NULL,
fecha_envio     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
observaciones   TEXT,
nombre_proyecto VARCHAR(200),
postular_proyecto BOOLEAN DEFAULT FALSE,
CONSTRAINT fk_respuesta_practica
    FOREIGN KEY (practica_id) REFERENCES instancias_practica(id),
CONSTRAINT fk_respuesta_plantilla
    FOREIGN KEY (plantilla_id) REFERENCES encuesta_plantilla(id),
    -- Una sola encuesta por práctica por tipo
CONSTRAINT uq_encuesta_practica_tipo
    UNIQUE (practica_id, tipo)
);

-- Respuestas individuales por pregunta
CREATE TABLE encuesta_item_respuesta (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    respuesta_id    BIGINT NOT NULL,
    pregunta_id     BIGINT NOT NULL,
    valor_escala    INT,
    valor_texto     TEXT,
    valor_booleano  BOOLEAN,
    CONSTRAINT fk_item_respuesta
        FOREIGN KEY (respuesta_id) REFERENCES encuesta_respuesta(id),
    CONSTRAINT fk_item_pregunta
        FOREIGN KEY (pregunta_id) REFERENCES encuesta_pregunta(id)
);

-- ─────────────────────────────────────────────────────────────────
-- DATOS INICIALES — Encuesta estudiante (del PDF)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO encuesta_plantilla (tipo, version, nombre) VALUES
    ('ESTUDIANTE', '2026-1', 'Satisfacción Estudiantes en Práctica Empresarial 2026-1'),
    ('TUTOR',      '2026-1', 'Evaluación Tutor Empresarial 2026-1');

-- Secciones encuesta ESTUDIANTE (plantilla_id = 1)
INSERT INTO encuesta_seccion (plantilla_id, codigo, titulo, orden) VALUES
    (1, 'A', 'Evaluación Tutor/Instructor Empresarial', 1),
    (1, 'B', 'Evaluación Centro de Práctica',           2),
    (1, 'C', 'Evaluación Proceso de Gestión de Práctica', 3),
    (1, 'D', 'Evaluación Docente de Práctica',          4);

-- Sección A — Tutor empresarial
INSERT INTO encuesta_pregunta (seccion_id, orden, texto, tipo) VALUES
    (1, 1, 'Generación del espacio requerido de inducción a la organización y/o área donde se realiza la práctica.', 'ESCALA'),
    (1, 2, 'Apoyo y retroalimentación por parte del tutor e instructor empresarial para la planeación y desarrollo de la práctica.', 'ESCALA'),
    (1, 3, 'Apoyo por parte del tutor e instructor empresarial para que en el desarrollo de la práctica se puedan lograr aprendizajes significativos.', 'ESCALA'),
    (1, 4, 'Grado en el cual el tutor e instructor empresarial lo empodera y lo hace parte del equipo de trabajo de la organización.', 'ESCALA'),
    (1, 5, 'Satisfacción con la relación tutor e instructor empresarial-estudiante, basándose esta en valores de respeto y tolerancia.', 'ESCALA');

-- Sección B — Centro de práctica
INSERT INTO encuesta_pregunta (seccion_id, orden, texto, tipo) VALUES
    (2, 1, 'Grado en el cual el centro de práctica dispone de los recursos necesarios (instalaciones, equipos, conectividad, etc.) para el desarrollo de la misma.', 'ESCALA'),
    (2, 2, 'Facilidad con la que el centro de práctica promueve el aprendizaje, desarrollo y fortalecimiento de competencias.', 'ESCALA'),
    (2, 3, 'El ambiente laboral promueve el desarrollo de habilidades interpersonales basadas en el bienestar.', 'ESCALA');

-- Sección C — Proceso de gestión
INSERT INTO encuesta_pregunta (seccion_id, orden, texto, tipo) VALUES
    (3, 1, 'Oportunidad en la respuesta por parte de la Universidad a las inquietudes y/o dificultades con el desarrollo de la práctica.', 'ESCALA'),
    (3, 2, 'Gestión de la universidad para el adecuado desarrollo de la práctica.', 'ESCALA');

-- Sección D — Docente asesor
INSERT INTO encuesta_pregunta (seccion_id, orden, texto, tipo) VALUES
    (4, 1, 'Capacidad del docente para relacionar la teoría con la práctica y orientar la adecuada planeación y ejecución del proyecto de práctica.', 'ESCALA'),
    (4, 2, 'Orientación y apoyo del docente con los saberes requeridos de la profesión para el desarrollo de la práctica.', 'ESCALA'),
    (4, 3, 'Cumplimiento del docente en las asesorías pactadas y la retroalimentación oportuna durante el desarrollo de la práctica.', 'ESCALA'),
    (4, 4, 'Satisfacción con la relación docente asesor-estudiante, basándose esta en valores de respeto y tolerancia.', 'ESCALA');

-- Secciones encuesta TUTOR (plantilla_id = 2)
INSERT INTO encuesta_seccion (plantilla_id, codigo, titulo, orden) VALUES
    (2, 'A', 'Evaluación del desempeño del estudiante', 1),
    (2, 'B', 'Evaluación de competencias profesionales', 2);

-- Preguntas genéricas tutor
INSERT INTO encuesta_pregunta (seccion_id, orden, texto, tipo) VALUES
    (5, 1, 'Puntualidad y cumplimiento del estudiante en sus responsabilidades.', 'ESCALA'),
    (5, 2, 'Actitud y disposición del estudiante frente a las tareas asignadas.', 'ESCALA'),
    (5, 3, 'Capacidad del estudiante para trabajar en equipo.', 'ESCALA'),
    (5, 4, 'Nivel de responsabilidad y autonomía demostrado por el estudiante.', 'ESCALA'),
    (5, 5, 'Satisfacción general con el desempeño del estudiante en la empresa.', 'ESCALA'),
    (6, 1, 'Aplicación de conocimientos teóricos en el contexto laboral.', 'ESCALA'),
    (6, 2, 'Capacidad de adaptación a los procesos y cultura organizacional.', 'ESCALA'),
    (6, 3, 'Calidad del trabajo entregado durante la práctica.', 'ESCALA'),
    (6, 4, 'Observaciones adicionales sobre el desempeño del estudiante.', 'TEXTO');