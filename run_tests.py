import urllib.request
import json
import time

def do_req(url, method, body=None, token=None):
    req = urllib.request.Request("http://localhost:8082" + url, method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    if body:
        data = json.dumps(body).encode("utf-8")
        req.data = data
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, response.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")

# 1. Registrar Admin (sin body)
status, _ = do_req("/api/auth/register-admin", "POST")
print(f"Registrar Admin: {status}")

# 2. Login Admin
status, res = do_req("/api/auth/login", "POST", {"email": "admin@universidad.edu.co", "password": "admin123"})
print(f"Login Admin: {status}")
token = json.loads(res).get("token")
print(f"Token obtained: {len(token) > 0}")

# 3. Configuracion
status, _ = do_req("/api/configuracion/catalogos", "POST", {"numeroPractica": 1, "nombre": "Practica Empresarial", "materiaNucleo": "Ingenieria", "materiaNucleoCodigo": "ING-101", "programaId": 1, "cortesPorPractica": 3, "duracionSemanas": 16, "documentosRequeridos": "Hoja de Vida"}, token)
print(f"Crear Catalogo: {status}")

# 4. Usuarios
status, _ = do_req("/api/usuarios", "GET", token=token)
print(f"Listar Usuarios: {status}")

# 5. Vacantes
status, _ = do_req("/api/vacantes/pendientes", "GET", token=token)
print(f"Listar Vacantes: {status}")

# 6. Vinculaciones
status, _ = do_req("/api/vinculaciones", "GET", token=token)
print(f"Listar Vinculaciones: {status}")

# 7. Documentos
status, _ = do_req("/api/documentos", "GET", token=token)
print(f"Listar Documentos: {status}")

print("DONE!")
