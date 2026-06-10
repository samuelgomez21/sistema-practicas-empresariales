$files = Get-ChildItem -Path src -Recurse -Filter *.java
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    $content = $content -replace "'SECRETARIA'", "'SECRETARIA_COORDINACION'"
    $content = $content -replace "Rol\.Nombre\.SECRETARIA\b", "Rol.Nombre.SECRETARIA_COORDINACION"
    $content = $content -replace "'COORDINACION_ACADEMICA'", "'COORDINADOR_ACADEMICO'"
    $content = $content -replace "Rol\.Nombre\.COORDINACION_ACADEMICA\b", "Rol.Nombre.COORDINADOR_ACADEMICO"
    $content = $content -replace "'EMPRESA_VINCULADA'", "'TUTOR_EMPRESARIAL'"
    $content = $content -replace "Rol\.Nombre\.EMPRESA_VINCULADA\b", "Rol.Nombre.TUTOR_EMPRESARIAL"
    $content = $content -replace "'DIRECCION',\s*", ""
    $content = $content -replace ",\s*'DIRECCION'", ""
    $content = $content -replace "Rol\.Nombre\.DIRECCION\b", "Rol.Nombre.ADMINISTRADOR"
    if ($content -cne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated $($file.Name)"
    }
}
