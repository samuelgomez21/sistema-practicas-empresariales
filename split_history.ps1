$ErrorActionPreference = "Stop"

# 1. Modulo Postulacion
git checkout feature/modulo-postulacion
git reset HEAD~1
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/model/Postulacion.java
git commit -m "feat(postulacion): crear entidad de dominio para postulaciones"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/repository/PostulacionRepository.java
git commit -m "feat(postulacion): añadir repositorio JPA"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/dto/PostulacionCreateDto.java
git commit -m "feat(postulacion): definir DTO para creacion"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/dto/PostulacionUpdateDto.java
git commit -m "feat(postulacion): definir DTO para actualizacion"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/dto/PostulacionResponse.java
git commit -m "feat(postulacion): definir DTO de respuesta"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/service/PostulacionFacade.java
git commit -m "feat(postulacion): declarar interfaz facade de servicio"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/service/PostulacionFacadeImpl.java
git commit -m "feat(postulacion): implementar logica de negocio en facade"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/controller/PostulacionController.java
git commit -m "feat(postulacion): exponer API REST de postulaciones"

# 2. Modulo Vinculacion y Documentos
git checkout feature/modulo-vinculacion-documentos
git reset HEAD~1
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/model/Vinculacion.java
git commit -m "feat(vinculacion): crear entidad de vinculacion"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/model/Documento.java
git commit -m "feat(documento): crear entidad de documento"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/repository/VinculacionRepository.java
git commit -m "feat(vinculacion): añadir repositorio JPA"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/repository/DocumentoRepository.java
git commit -m "feat(documento): añadir repositorio JPA"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/dto/VinculacionCreateDto.java
git commit -m "feat(vinculacion): definir DTO de creacion"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/dto/VinculacionUpdateDto.java
git commit -m "feat(vinculacion): definir DTO de actualizacion"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/dto/VinculacionResponse.java
git commit -m "feat(vinculacion): definir DTO de respuesta"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/dto/DocumentoCreateDto.java
git commit -m "feat(documento): definir DTO de creacion"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/dto/DocumentoUpdateDto.java
git commit -m "feat(documento): definir DTO de actualizacion"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/dto/DocumentoResponse.java
git commit -m "feat(documento): definir DTO de respuesta"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/service/VinculacionFacade.java
git commit -m "feat(vinculacion): declarar interfaz de servicio"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/service/VinculacionFacadeImpl.java
git commit -m "feat(vinculacion): implementar logica de negocio"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/service/DocumentoFacade.java
git commit -m "feat(documento): declarar interfaz de servicio"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/service/DocumentoFacadeImpl.java
git commit -m "feat(documento): implementar logica de negocio"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/controller/VinculacionController.java
git commit -m "feat(vinculacion): exponer API REST de vinculaciones"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/controller/DocumentoController.java
git commit -m "feat(documento): exponer API REST de documentos"

# 3. Quality and Sonar
git checkout feature/quality-and-sonar
git reset HEAD~1
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/infraestructura/util/Validations.java
git commit -m "refactor(util): abstraer validaciones comunes para evitar NPE"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/auth/service/AuthFacadeImpl.java
git commit -m "refactor(auth): eliminar contraseñas hardcodeadas y limpiar facade"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/practica/dto/PracticaDetalleDto.java src/main/java/co/edu/sistema_practicas_empresariales/modules/practica/dto/PracticaResumenDto.java
git commit -m "refactor(practica): eliminar importaciones no utilizadas en DTOs"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/practica/service/PracticaService.java src/main/java/co/edu/sistema_practicas_empresariales/modules/practica/service/impl/PracticaServiceImpl.java
git commit -m "refactor(practica): limpiar codigo muerto y warnings en servicio"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/controller/VinculacionController.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/service/VinculacionFacadeImpl.java
git commit -m "refactor(vinculacion): resolver advertencias de sonar y codigo no usado"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/service/PostulacionFacadeImpl.java
git commit -m "refactor(postulacion): implementar validaciones robustas y javadoc"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/model/Documento.java
git commit -m "refactor(documento): corregir advertencias estructurales"

# 4. Soft Delete Architecture
git checkout feature/soft-delete-architecture
git reset HEAD~1
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/usuario/model/Usuario.java src/main/java/co/edu/sistema_practicas_empresariales/modules/usuario/repository/UsuarioRepository.java src/main/java/co/edu/sistema_practicas_empresariales/modules/usuario/service/UsuarioServiceImpl.java
git commit -m "feat(usuario): migrar a arquitectura de soft delete"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/model/Vacante.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/repository/VacanteRepository.java
git commit -m "feat(vacante): aplicar patron de borrado logico"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/model/Postulacion.java
git commit -m "feat(postulacion): aplicar patron de borrado logico"
git add src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/model/Vinculacion.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/dto/VinculacionCreateDto.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/dto/VinculacionUpdateDto.java
git commit -m "feat(vinculacion): integrar soporte para borrado logico"

# 5. Test Infrastructure
git checkout feature/test-infrastructure
git reset HEAD~1
git add pom.xml
git commit -m "test(deps): configurar dependencias de h2 y testing"
git add src/main/resources/application-test.yml
git commit -m "test(config): definir propiedades para entorno de pruebas"
git add src/test/resources/application.yml
git commit -m "test(config): añadir configuracion base para tests"
git add src/test/java/co/edu/sistema_practicas_empresariales/SistemaPracticasEmpresarialesApplicationTests.java
git commit -m "test(context): habilitar perfiles de prueba en aplicacion"

git checkout feature/postulaciones-modelo
Write-Host "History rewritten with atomic commits!"
