$ErrorActionPreference = "Stop"

# Reset feature/postulaciones-modelo to 30d8c13
git checkout feature/postulaciones-modelo
git reset --hard 30d8c13

# Create Postulacion Branch
git checkout -b feature/modulo-postulacion 30d8c13
git checkout 2e2712a -- src/main/java/co/edu/sistema_practicas_empresariales/modules/vacante/postulacion/
git commit -m "Feat: Implementar modulo de Postulacion (DTOs, Repository, Service, Controller)"

# Create Vinculacion and Documento Branch
git checkout -b feature/modulo-vinculacion-documentos 30d8c13
git checkout 2e2712a -- src/main/java/co/edu/sistema_practicas_empresariales/modules/vinculacion/ src/main/java/co/edu/sistema_practicas_empresariales/modules/documento/
git commit -m "Feat: Implementar modulos de Vinculacion y Documentos (DTOs, Repository, Service, Controller)"

Write-Host "Branches created successfully for new modules!"
