import json

def create_request(name, method, url_path, body=None):
    req = {
        "name": name,
        "request": {
            "method": method,
            "header": [
                {
                    "key": "Content-Type",
                    "value": "application/json",
                    "type": "text"
                }
            ],
            "url": {
                "raw": "{{baseUrl}}" + url_path,
                "host": ["{{baseUrl}}"],
                "path": [p for p in url_path.split("/") if p]
            }
        },
        "response": []
    }
    
    if not ("auth" in url_path and method == "POST"):
        req["request"]["auth"] = {
            "type": "bearer",
            "bearer": [
                {
                    "key": "token",
                    "value": "{{jwt_token}}",
                    "type": "string"
                }
            ]
        }
        
    if body:
        req["request"]["body"] = {
            "mode": "raw",
            "raw": json.dumps(body, indent=2)
        }
    return req

collection = {
    "info": {
        "name": "Pruebas Sustentacion PERFECTAS",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:8082"
        },
        {
            "key": "jwt_token",
            "value": "pega_el_token_aqui"
        }
    ],
    "item": [
        {
            "name": "1. Modulo Seguridad (Auth)",
            "item": [
                create_request("Registrar Admin Semilla", "POST", "/api/auth/register-admin"),
                create_request("Login Administrador", "POST", "/api/auth/login", {"email": "admin@universidad.edu.co", "password": "admin123"})
            ]
        },
        {
            "name": "2. Modulo Configuracion",
            "item": [
                create_request("Crear Facultad", "POST", "/api/facultades", {"nombre": "Ingenieria", "codigo": "ING01"}),
                create_request("Listar Facultades", "GET", "/api/facultades"),
                create_request("Actualizar Facultad", "PUT", "/api/facultades/1", {"nombre": "Ingenieria y Sistemas", "codigo": "ING01"}),
                create_request("Eliminar Facultad", "DELETE", "/api/facultades/1"),
                create_request("Crear Programa", "POST", "/api/programas", {"facultadId": 1, "nombre": "Sistemas", "codigo": "SIS01"}),
                create_request("Listar Programas", "GET", "/api/programas"),
                create_request("Actualizar Programa", "PUT", "/api/programas/1", {"facultadId": 1, "nombre": "Sistemas Computacionales", "codigo": "SIS01"}),
                create_request("Eliminar Programa", "DELETE", "/api/programas/1"),
                create_request("Crear Catalogo", "POST", "/api/configuracion/catalogos", {"numeroPractica": 1, "nombre": "Practica Empresarial", "materiaNucleo": "Ingenieria", "materiaNucleoCodigo": "ING-101", "programaId": 1, "cortesPorPractica": 3, "duracionSemanas": 16, "documentosRequeridos": "Hoja de Vida"}),
                create_request("Obtener Info Sistema", "GET", "/api/configuracion/info")
            ]
        },
        {
            "name": "3. Modulo Usuarios",
            "item": [
                create_request("Crear Usuario", "POST", "/api/usuarios", {"email": "nuevo@universidad.edu.co", "nombre": "Usuario Prueba", "password": "securepassword", "activo": True, "rol": "DOCENTE_ASESOR"}),
                create_request("Obtener Todos los Usuarios", "GET", "/api/usuarios")
            ]
        },
        {
            "name": "4. Modulo Vacantes",
            "item": [
                create_request("Crear Vacante", "POST", "/api/vacantes", {"empresaId": 1, "titulo": "Practicante", "descripcion": "Desarrollo", "perfilRequerido": "Estudiante", "requisitos": "Java", "cuposTotales": 2, "programaId": 1, "modalidad": "Presencial", "salario": 1000000, "tipoContrato": "Aprendizaje", "horario": "L-V 8-5"}),
                create_request("Vacantes Pendientes", "GET", "/api/vacantes/pendientes")
            ]
        },
        {
            "name": "5. Modulo Vinculaciones",
            "item": [
                create_request("Crear Vinculacion", "POST", "/api/vinculaciones", {"postulacionId": 1, "tutorEmpresarialId": 1, "fechaInicio": "2026-07-01", "fechaFin": "2026-12-01"}),
                create_request("Listar Vinculaciones", "GET", "/api/vinculaciones")
            ]
        },
        {
            "name": "6. Modulo Documentos",
            "item": [
                create_request("Subir Documento", "POST", "/api/documentos", {"vinculacionId": 1, "tipoDocumento": "PLAN_TRABAJO", "urlArchivo": "http://ejemplo.com/doc.pdf"}),
                create_request("Listar Documentos", "GET", "/api/documentos")
            ]
        }
    ]
}

with open("Pruebas_Sustentacion_PERFECTAS.postman_collection.json", "w") as f:
    json.dump(collection, f, indent=2)

print("Collection perfect generated!")
