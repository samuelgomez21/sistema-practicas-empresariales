# Etapa de construcción (Build)
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copiamos primero el wrapper y el pom.xml para aprovechar la caché de Docker
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Le damos permisos de ejecución al wrapper
RUN chmod +x mvnw

# Descargamos las dependencias sin compilar el código aún (esto se cachea)
RUN ./mvnw dependency:go-offline

# Copiamos el código fuente
COPY src ./src

# Compilamos el proyecto omitiendo las pruebas para mayor velocidad
RUN ./mvnw clean package -DskipTests

# Etapa de ejecución (Run)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiamos el archivo JAR compilado desde la etapa anterior
COPY --from=builder /app/target/sistema_practicas_empresariales-0.0.1-SNAPSHOT.jar app.jar

# Variables de entorno por defecto
ENV DB_URL=jdbc:mysql://localhost:3306/practicas_uah
ENV DB_USER=root
ENV DB_PASSWORD=

# Exponemos el puerto de la aplicación (asumiendo 8080 u 8082 según tu config)
EXPOSE 8082

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
