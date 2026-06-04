$PORT = 58017
$BASE = "http://localhost:$PORT"

# Register admin (ignore conflict if already exists)
try {
    Invoke-RestMethod -Method Post -Uri "$BASE/api/auth/register-admin" -ContentType "application/json" -Body "{}" -ErrorAction Stop
    Write-Host "Admin registered"
} catch {
    Write-Host "Admin registration skipped (probably already exists)"
}

# Login and obtain JWT
$login = Invoke-RestMethod -Method Post -Uri "$BASE/api/auth/login" -ContentType "application/json" -Body '{"email":"admin@universidad.edu.co","password":"admin123"}'
$jwt = $login.accessToken
Write-Host "JWT obtained (first 30 chars): $($jwt.Substring(0,30))..."

$headers = @{ Authorization = "Bearer $jwt" }

# GET all users
Write-Host "GET /api/usuarios"
$users = Invoke-RestMethod -Method Get -Uri "$BASE/api/usuarios" -Headers $headers
$users | ConvertTo-Json -Depth 5 | Write-Host

# CREATE a new user
Write-Host "POST /api/usuarios (create)"
$newUser = Invoke-RestMethod -Method Post -Uri "$BASE/api/usuarios" -Headers $headers -ContentType "application/json" -Body '{"email":"nuevo@universidad.edu.co","nombre":"Nuevo Usuario","activo":true,"rol":"ESTUDIANTE"}'
Write-Host "Created user with ID: $($newUser.id)"

# UPDATE the newly created user
Write-Host "PUT /api/usuarios/{id} (update)"
Invoke-RestMethod -Method Put -Uri "$BASE/api/usuarios/$($newUser.id)" -Headers $headers -ContentType "application/json" -Body '{"email":"actualizado@universidad.edu.co","nombre":"Usuario Actualizado","activo":false,"rol":"ESTUDIANTE"}'
Write-Host "User updated"

# DELETE the user
Write-Host "DELETE /api/usuarios/{id} (delete)"
Invoke-RestMethod -Method Delete -Uri "$BASE/api/usuarios/$($newUser.id)" -Headers $headers
Write-Host "User deleted"

Write-Host "All API tests completed successfully"
