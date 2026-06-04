$ErrorActionPreference = "Stop"

# Branch 1
git checkout -b feature/quality-and-sonar 2e2712a
git checkout stash@{0} -- src/main/java/co/edu/sistema_practicas_empresariales/modules/auth/service/AuthFacadeImpl.java src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/model/Documento.java src/main/java/co/edu/sistema_practicas_empresariales/modules/practica/dto/PracticaDetalleDto.java src/main/java/co/edu/sistema_practicas_empresariales/modules/practica/dto/PracticaResumenDto.java src/main/java/co/edu/sistema_practicas_empresariales/modules/practica/service/PracticaService.java src/main/java/co/edu/sistema_practicas_empresariales/modules/practica/service/impl/PracticaServiceImpl.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/controller/VinculacionController.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/service/VinculacionFacadeImpl.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/service/PostulacionFacadeImpl.java src/main/java/co/edu/sistema_practicas_empresariales/modules/infraestructura/util/
git commit -m "Refactor: Resolve SonarQube warnings, unused imports, and hardcoded passwords"

# Branch 2
git checkout -b feature/soft-delete-architecture 2e2712a
git checkout stash@{0} -- src/main/java/co/edu/sistema_practicas_empresariales/modules/usuario/model/Usuario.java src/main/java/co/edu/sistema_practicas_empresariales/modules/usuario/repository/UsuarioRepository.java src/main/java/co/edu/sistema_practicas_empresariales/modules/usuario/service/UsuarioServiceImpl.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/model/Vacante.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/model/Postulacion.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/repository/VacanteRepository.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/dto/VinculacionCreateDto.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/dto/VinculacionUpdateDto.java src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/model/Vinculacion.java
git commit -m "Feat: Implement global soft delete architecture across entities"

# Branch 3
git checkout -b feature/test-infrastructure 2e2712a
git checkout stash@{0} -- pom.xml src/test/java/co/edu/sistema_practicas_empresariales/SistemaPracticasEmpresarialesApplicationTests.java src/test/resources/ src/main/resources/application-test.yml
git commit -m "Test: Configure H2 test infrastructure and JWT profiles"

git checkout feature/postulaciones-modelo
git stash drop stash@{0}
Write-Host "All branches created, files restored from stash, and committed successfully!"
