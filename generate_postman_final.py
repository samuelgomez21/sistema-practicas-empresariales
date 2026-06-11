{
  "info": {
    "name": "Sistema Prácticas Empresariales UAH — Completo",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "base_url",      "value": "http://localhost:8080/api" },
    { "key": "token",         "value": "" },
    { "key": "practica_id",   "value": "1" },
    { "key": "estudiante_id", "value": "1" },
    { "key": "empresa_id",    "value": "1" },
    { "key": "catalogo_id",   "value": "1" },
    { "key": "docente_id",    "value": "1" },
    { "key": "avance_id",     "value": "1" },
    { "key": "programa_id",   "value": "1" },
    { "key": "usuario_id",    "value": "1" },
    { "key": "tutor_id",      "value": "1" },
    { "key": "documento_id",  "value": "1" }
  ],
  "item": [
    {
      "name": "🔐 Auth",
      "item": [
        {
          "name": "Crear admin semilla",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/register-admin",
            "header": []
          }
        },
        {
          "name": "Login Admin",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.token) {",
                  "  pm.collectionVariables.set('token', r.token);",
                  "  console.log('✅ Token Admin guardado');",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@universidad.edu.co\",\n  \"password\": \"admin123\"\n}"
            }
          }
        },
        {
          "name": "Login Coordinador Práctica",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.token) {",
                  "  pm.collectionVariables.set('token', r.token);",
                  "  console.log('✅ Token Coordinador guardado');",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"coordinador@example.com\",\n  \"password\": \"coord123\"\n}"
            }
          }
        },
        {
          "name": "Cambiar password primer ingreso",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/cambiar-password-inicial",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"coordinador@example.com\",\n  \"currentPassword\": \"coord123\",\n  \"newPassword\": \"NuevaClave2024!\"\n}"
            }
          }
        },
        {
          "name": "Solicitar recuperación password",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/recuperar-password",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@universidad.edu.co\"\n}"
            }
          }
        },
        {
          "name": "Reset password con token",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/reset-password",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"token\": \"TOKEN_DEL_CORREO\",\n  \"newPassword\": \"NuevaClave2024!\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "👤 Usuarios",
      "item": [
        {
          "name": "Listar todos",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/usuarios",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Obtener por ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/usuarios/{{usuario_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Crear usuario",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/usuarios",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"docente@universidad.edu.co\",\n  \"nombre\": \"Dr. Carlos Ramírez\",\n  \"rolNombre\": \"DOCENTE_ASESOR\"\n}"
            }
          }
        },
        {
          "name": "Actualizar usuario",
          "request": {
            "method": "PUT",
            "url": "{{base_url}}/usuarios/{{usuario_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nombre\": \"Dr. Carlos Ramírez Actualizado\"\n}"
            }
          }
        },
        {
          "name": "Eliminar usuario (soft delete)",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/usuarios/{{usuario_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    },
    {
      "name": "🎓 Estudiantes",
      "item": [
        {
          "name": "Listar todos",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/estudiantes",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Obtener por ID",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) pm.collectionVariables.set('estudiante_id', r.id);"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "url": "{{base_url}}/estudiantes/{{estudiante_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Obtener por usuario ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/estudiantes/usuario/{{usuario_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Listar por programa",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/estudiantes/programa/{{programa_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Listar aptos para práctica",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/estudiantes/aptos",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Registrar estudiante",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) {",
                  "  pm.collectionVariables.set('estudiante_id', r.id);",
                  "  console.log('✅ Estudiante creado ID:', r.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/estudiantes",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"identificacion\": \"1046527082\",\n  \"nombre\": \"Carlos Mendoza\",\n  \"email\": \"c.mendoza@universidad.edu.co\",\n  \"telefono\": \"3001234567\",\n  \"contactoEmergencia\": \"Rosa Mendoza - 3009876543\",\n  \"programaId\": 1,\n  \"semestre\": 8,\n  \"creditosAprobados\": 148,\n  \"promedioAcumulado\": 4.1\n}"
            }
          }
        },
        {
          "name": "Registro masivo desde Excel",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/estudiantes/masivo",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "file",
                  "type": "file",
                  "src": "",
                  "description": "Selecciona el archivo Excel con los estudiantes"
                }
              ]
            }
          }
        },
        {
          "name": "Actualizar estudiante",
          "request": {
            "method": "PUT",
            "url": "{{base_url}}/estudiantes/{{estudiante_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"semestre\": 9,\n  \"creditosAprobados\": 165,\n  \"promedioAcumulado\": 4.2\n}"
            }
          }
        },
        {
          "name": "Evaluar aptitud",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/estudiantes/{{estudiante_id}}/evaluar-aptitud/1",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Historial de prácticas",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/estudiantes/{{estudiante_id}}/practicas",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Eliminar estudiante (soft delete)",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/estudiantes/{{estudiante_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    },
    {
      "name": "🏢 Empresas",
      "item": [
        {
          "name": "Listar todas",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/empresas",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Obtener por ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/empresas/{{empresa_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Registrar empresa",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) {",
                  "  pm.collectionVariables.set('empresa_id', r.id);",
                  "  console.log('✅ Empresa creada ID:', r.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/empresas",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nit\": \"900123456-1\",\n  \"razonSocial\": \"TechCo S.A.S.\",\n  \"sectorEconomico\": \"Tecnología\",\n  \"direccion\": \"Calle 14 # 15-30\",\n  \"municipio\": \"Armenia\",\n  \"telefono\": \"(606) 555-0202\",\n  \"contactoPrincipalNombre\": \"Carlos Ruiz\",\n  \"contactoPrincipalEmail\": \"c.ruiz@techco.com\"\n}"
            }
          }
        },
        {
          "name": "Actualizar empresa",
          "request": {
            "method": "PUT",
            "url": "{{base_url}}/empresas/{{empresa_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"telefono\": \"(606) 555-9999\",\n  \"direccion\": \"Carrera 20 # 10-15\"\n}"
            }
          }
        },
        {
          "name": "Eliminar empresa (soft delete)",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/empresas/{{empresa_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Registrar tutor",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) pm.collectionVariables.set('tutor_id', r.id);"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/empresas/{{empresa_id}}/tutores",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nombreCompleto\": \"Miguel Torres\",\n  \"cargo\": \"Director Técnico\",\n  \"correo\": \"m.torres@techco.com\",\n  \"telefono\": \"3117778899\"\n}"
            }
          }
        },
        {
          "name": "Listar tutores de empresa",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/empresas/{{empresa_id}}/tutores",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Eliminar tutor",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/empresas/tutores/{{tutor_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    },
    {
      "name": "⚙️ Configuración",
      "item": [
        {
          "name": "Info del sistema",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/configuracion/info",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Listar catálogos por programa",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r && r.length > 0) {",
                  "  pm.collectionVariables.set('catalogo_id', r[0].id);",
                  "  console.log('✅ Catálogo ID guardado:', r[0].id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "url": "{{base_url}}/configuracion/programas/{{programa_id}}/catalogos",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Crear catálogo de práctica",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) {",
                  "  pm.collectionVariables.set('catalogo_id', r.id);",
                  "  console.log('✅ Catálogo creado ID:', r.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/configuracion/catalogos",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"numeroPractica\": 1,\n  \"nombre\": \"Práctica I\",\n  \"materiaNucleo\": \"Proyecto de Grado I\",\n  \"materiaNucleoCodigo\": \"PGI-001\",\n  \"programaId\": 1,\n  \"cortesPorPractica\": 3,\n  \"duracionSemanas\": 16\n}"
            }
          }
        },
        {
          "name": "Cambiar estado catálogo",
          "request": {
            "method": "PATCH",
            "url": {
              "raw": "{{base_url}}/configuracion/catalogos/{{catalogo_id}}/estado?activo=true",
              "query": [{ "key": "activo", "value": "true" }]
            },
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    },
    {
      "name": "📚 Prácticas",
      "item": [
        {
          "name": "Listar todas",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Listar por estado — ASIGNADA_PENDIENTE_INICIO",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas/estado/ASIGNADA_PENDIENTE_INICIO",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Listar por estado — EN_PRACTICA",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas/estado/EN_PRACTICA",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Listar por docente",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas/docente/{{docente_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Detalle práctica",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas/{{practica_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Práctica activa del estudiante",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas/estudiante/{{estudiante_id}}/activa",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Crear práctica automática",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) {",
                  "  pm.collectionVariables.set('practica_id', r.id);",
                  "  console.log('✅ Práctica creada ID:', r.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": {
              "raw": "{{base_url}}/practicas/crear-automatica?estudianteId={{estudiante_id}}&catalogoId={{catalogo_id}}",
              "query": [
                { "key": "estudianteId", "value": "{{estudiante_id}}" },
                { "key": "catalogoId",   "value": "{{catalogo_id}}"   }
              ]
            },
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Asignar docente",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/asignar-docente",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"docenteId\": {{docente_id}}\n}"
            }
          }
        },
        {
          "name": "Asignar empresa",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/asignar-empresa",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"empresaId\": {{empresa_id}}\n}"
            }
          }
        },
        {
          "name": "Asignar tutor empresarial",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/asignar-tutor",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"tutorId\": {{tutor_id}}\n}"
            }
          }
        },
        {
          "name": "Iniciar vinculación",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/iniciar-vinculacion",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Registrar convenio",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/registrar-convenio",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Activar práctica — EN_PRACTICA",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/activar",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Registrar fecha sustentación",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/fecha-sustentacion",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"fechaSustentacion\": \"2025-07-30\"\n}"
            }
          }
        },
        {
          "name": "Subir ARL",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/practicas/{{practica_id}}/documentos?categoria=ARL",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "archivo", "type": "file", "src": "" }
              ]
            }
          }
        },
        {
          "name": "Subir Planeador",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/practicas/{{practica_id}}/documentos?categoria=PLANEADOR",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "archivo", "type": "file", "src": "" }
              ]
            }
          }
        },
        {
          "name": "Subir Informe Ejecutivo",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/practicas/{{practica_id}}/documentos?categoria=INFORME_EJECUTIVO",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "archivo", "type": "file", "src": "" }
              ]
            }
          }
        },
        {
          "name": "Subir Presentación",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/practicas/{{practica_id}}/documentos?categoria=PRESENTACION",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "archivo", "type": "file", "src": "" }
              ]
            }
          }
        },
        {
          "name": "Subir Documento Final",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/practicas/{{practica_id}}/documentos?categoria=DOCUMENTO_FINAL",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "body": {
              "mode": "formdata",
              "formdata": [
                { "key": "archivo", "type": "file", "src": "" }
              ]
            }
          }
        },
        {
          "name": "Checklist paz y salvo",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas/{{practica_id}}/checklist",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "¿Tiene paz y salvo?",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas/{{practica_id}}/paz-y-salvo",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Generar acta de cierre",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/practicas/{{practica_id}}/acta-cierre",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Cancelar práctica",
          "request": {
            "method": "PATCH",
            "url": {
              "raw": "{{base_url}}/practicas/{{practica_id}}/cancelar?motivo=Retiro voluntario",
              "query": [{ "key": "motivo", "value": "Retiro voluntario" }]
            },
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    },
    {
      "name": "📋 Avances",
      "item": [
        {
          "name": "Listar avances de práctica",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas/{{practica_id}}/avances",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Avances pendientes del docente",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/docentes/{{docente_id}}/avances/pendientes",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Crear avance con archivo",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "const data = r.data || r;",
                  "if (data.id) pm.collectionVariables.set('avance_id', data.id);"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/practicas/{{practica_id}}/avances",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "datos",
                  "value": "{\"titulo\": \"Avance semana 1\", \"descripcion\": \"Primer acercamiento al equipo de desarrollo. Revisión de arquitectura del proyecto.\"}",
                  "type": "text",
                  "contentType": "application/json"
                },
                {
                  "key": "archivo",
                  "type": "file",
                  "src": "",
                  "description": "Opcional"
                }
              ]
            }
          }
        },
        {
          "name": "Crear avance sin archivo",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "const data = r.data || r;",
                  "if (data.id) pm.collectionVariables.set('avance_id', data.id);"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/practicas/{{practica_id}}/avances",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "datos",
                  "value": "{\"titulo\": \"Avance semana 2\", \"descripcion\": \"Implementación del módulo de autenticación completada.\"}",
                  "type": "text",
                  "contentType": "application/json"
                }
              ]
            }
          }
        },
        {
          "name": "Agregar comentario docente",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/avances/{{avance_id}}/comentario",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"comentario\": \"Buen avance. Profundizar en la documentación de la arquitectura y agregar diagramas de secuencia.\"\n}"
            }
          }
        },
        {
          "name": "Cambiar estado — EN_REVISION",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/avances/{{avance_id}}/estado/EN_REVISION",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Cambiar estado — REVISADO",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/avances/{{avance_id}}/estado/REVISADO",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Eliminar avance (soft delete)",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/avances/{{avance_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    },
    {
      "name": "📊 Evaluaciones",
      "item": [
        {
          "name": "Registrar nota docente",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/evaluaciones/docente/practica/{{practica_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"notaDocente\": 4.5,\n  \"observacionesDocente\": \"Excelente desempeño durante toda la práctica.\"\n}"
            }
          }
        },
        {
          "name": "Registrar nota tutor",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/evaluaciones/tutor/practica/{{practica_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"notaTutor\": 4.2,\n  \"observacionesTutor\": \"Estudiante comprometido y proactivo.\"\n}"
            }
          }
        },
        {
          "name": "Registrar nota final (coordinador)",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/evaluaciones/coordinador/practica/{{practica_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"notaFinal\": 4.3,\n  \"observacionesFinales\": \"Práctica completada satisfactoriamente.\"\n}"
            }
          }
        },
        {
          "name": "Obtener evaluación por práctica",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/evaluaciones/practica/{{practica_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    },
    {
      "name": "📝 Encuestas",
      "item": [
        {
          "name": "Obtener plantilla ESTUDIANTE",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/encuestas/plantilla/ESTUDIANTE",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Obtener plantilla TUTOR",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/encuestas/plantilla/TUTOR",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Enviar encuesta ESTUDIANTE",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/encuestas/practica/{{practica_id}}/tipo/ESTUDIANTE",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"plantillaId\": 1,\n  \"respuestas\": [\n    { \"preguntaId\": 1,  \"valorEscala\": 5 },\n    { \"preguntaId\": 2,  \"valorEscala\": 4 },\n    { \"preguntaId\": 3,  \"valorEscala\": 5 },\n    { \"preguntaId\": 4,  \"valorEscala\": 4 },\n    { \"preguntaId\": 5,  \"valorEscala\": 5 },\n    { \"preguntaId\": 6,  \"valorEscala\": 4 },\n    { \"preguntaId\": 7,  \"valorEscala\": 5 },\n    { \"preguntaId\": 8,  \"valorEscala\": 5 },\n    { \"preguntaId\": 9,  \"valorEscala\": 4 },\n    { \"preguntaId\": 10, \"valorEscala\": 5 },\n    { \"preguntaId\": 11, \"valorEscala\": 5 },\n    { \"preguntaId\": 12, \"valorEscala\": 4 },\n    { \"preguntaId\": 13, \"valorEscala\": 5 },\n    { \"preguntaId\": 14, \"valorEscala\": 5 }\n  ],\n  \"observaciones\": \"Excelente experiencia en la empresa.\",\n  \"nombreProyecto\": \"Sistema de Gestión de Inventarios\",\n  \"postularProyecto\": true\n}"
            }
          }
        },
        {
          "name": "Enviar encuesta TUTOR",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/encuestas/practica/{{practica_id}}/tipo/TUTOR",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"plantillaId\": 2,\n  \"respuestas\": [\n    { \"preguntaId\": 15, \"valorEscala\": 5 },\n    { \"preguntaId\": 16, \"valorEscala\": 4 },\n    { \"preguntaId\": 17, \"valorEscala\": 5 },\n    { \"preguntaId\": 18, \"valorEscala\": 4 },\n    { \"preguntaId\": 19, \"valorEscala\": 5 },\n    { \"preguntaId\": 20, \"valorEscala\": 5 },\n    { \"preguntaId\": 21, \"valorEscala\": 4 },\n    { \"preguntaId\": 22, \"valorEscala\": 5 },\n    { \"preguntaId\": 23, \"valorTexto\": \"Estudiante muy comprometido y proactivo.\" }\n  ],\n  \"observaciones\": \"Excelente desempeño durante la práctica.\"\n}"
            }
          }
        },
        {
          "name": "¿Encuesta ESTUDIANTE completada?",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/encuestas/practica/{{practica_id}}/tipo/ESTUDIANTE/completada",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "¿Encuesta TUTOR completada?",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/encuestas/practica/{{practica_id}}/tipo/TUTOR/completada",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Ver respuesta encuesta ESTUDIANTE",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/encuestas/practica/{{practica_id}}/tipo/ESTUDIANTE",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Ver respuesta encuesta TUTOR",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/encuestas/practica/{{practica_id}}/tipo/TUTOR",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Agregar pregunta a sección",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/encuestas/secciones/1/preguntas",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"texto\": \"¿El tutor realizó seguimiento periódico a sus actividades?\",\n  \"tipo\": \"ESCALA\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "📄 Documentos",
      "item": [
        {
          "name": "Listar todos",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/documentos",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Obtener por ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/documentos/{{documento_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Crear documento",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) pm.collectionVariables.set('documento_id', r.id);"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/documentos",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nombre\": \"Contrato práctica\",\n  \"url\": \"https://storage.firebase.com/doc.pdf\",\n  \"categoria\": \"CONTRATO\"\n}"
            }
          }
        },
        {
          "name": "Actualizar documento",
          "request": {
            "method": "PUT",
            "url": "{{base_url}}/documentos/{{documento_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nombre\": \"Contrato práctica actualizado\"\n}"
            }
          }
        },
        {
          "name": "Eliminar documento (soft delete)",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/documentos/{{documento_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    },
    {
      "name": "🔒 Cierre",
      "item": [
        {
          "name": "Verificar estado antes del cierre",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/cierre/practica/{{practica_id}}/verificar",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "Ejecutar cierre formal",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/cierre/practica/{{practica_id}}/ejecutar",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    },
    {
      "name": "🧪 Flujo completo — paso a paso",
      "item": [
        {
          "name": "PASO 1 — Crear admin semilla",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/register-admin",
            "header": []
          }
        },
        {
          "name": "PASO 2 — Login admin",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.token) {",
                  "  pm.collectionVariables.set('token', r.token);",
                  "  console.log('✅ Token guardado');",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@universidad.edu.co\",\n  \"password\": \"admin123\"\n}"
            }
          }
        },
        {
          "name": "PASO 3 — Crear catálogo de práctica",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) {",
                  "  pm.collectionVariables.set('catalogo_id', r.id);",
                  "  console.log('✅ Catálogo ID:', r.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/configuracion/catalogos",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"numeroPractica\": 1,\n  \"nombre\": \"Práctica I\",\n  \"materiaNucleo\": \"Proyecto de Grado I\",\n  \"materiaNucleoCodigo\": \"PGI-001\",\n  \"programaId\": 1,\n  \"cortesPorPractica\": 3,\n  \"duracionSemanas\": 16\n}"
            }
          }
        },
        {
          "name": "PASO 4 — Registrar empresa",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) {",
                  "  pm.collectionVariables.set('empresa_id', r.id);",
                  "  console.log('✅ Empresa ID:', r.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/empresas",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nit\": \"900123456-1\",\n  \"razonSocial\": \"TechCo S.A.S.\",\n  \"sectorEconomico\": \"Tecnología\",\n  \"municipio\": \"Armenia\",\n  \"contactoPrincipalNombre\": \"Carlos Ruiz\",\n  \"contactoPrincipalEmail\": \"c.ruiz@techco.com\"\n}"
            }
          }
        },
        {
          "name": "PASO 5 — Registrar tutor de la empresa",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) {",
                  "  pm.collectionVariables.set('tutor_id', r.id);",
                  "  console.log('✅ Tutor ID:', r.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/empresas/{{empresa_id}}/tutores",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nombreCompleto\": \"Miguel Torres\",\n  \"cargo\": \"Director Técnico\",\n  \"correo\": \"m.torres@techco.com\",\n  \"telefono\": \"3117778899\"\n}"
            }
          }
        },
        {
          "name": "PASO 6 — Registrar estudiante",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) {",
                  "  pm.collectionVariables.set('estudiante_id', r.id);",
                  "  console.log('✅ Estudiante ID:', r.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/estudiantes",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"identificacion\": \"1046527082\",\n  \"nombre\": \"Carlos Mendoza\",\n  \"email\": \"c.mendoza@universidad.edu.co\",\n  \"telefono\": \"3001234567\",\n  \"contactoEmergencia\": \"Rosa Mendoza - 3009876543\",\n  \"programaId\": 1,\n  \"semestre\": 8,\n  \"creditosAprobados\": 148,\n  \"promedioAcumulado\": 4.1\n}"
            }
          }
        },
        {
          "name": "PASO 7 — Evaluar aptitud estudiante",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/estudiantes/{{estudiante_id}}/evaluar-aptitud/1",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "PASO 8 — Crear práctica automática",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "if (r.id) {",
                  "  pm.collectionVariables.set('practica_id', r.id);",
                  "  console.log('✅ Práctica ID:', r.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": {
              "raw": "{{base_url}}/practicas/crear-automatica?estudianteId={{estudiante_id}}&catalogoId={{catalogo_id}}",
              "query": [
                { "key": "estudianteId", "value": "{{estudiante_id}}" },
                { "key": "catalogoId",   "value": "{{catalogo_id}}"   }
              ]
            },
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "PASO 9 — Asignar docente",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/asignar-docente",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"docenteId\": {{docente_id}}\n}"
            }
          }
        },
        {
          "name": "PASO 10 — Asignar empresa",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/asignar-empresa",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"empresaId\": {{empresa_id}}\n}"
            }
          }
        },
        {
          "name": "PASO 11 — Asignar tutor",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/asignar-tutor",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"tutorId\": {{tutor_id}}\n}"
            }
          }
        },
        {
          "name": "PASO 12 — Iniciar vinculación",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/iniciar-vinculacion",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "PASO 13 — Registrar convenio",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/registrar-convenio",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "PASO 14 — Activar práctica",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/practicas/{{practica_id}}/activar",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "PASO 15 — Crear avance",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const r = pm.response.json();",
                  "const data = r.data || r;",
                  "if (data.id) {",
                  "  pm.collectionVariables.set('avance_id', data.id);",
                  "  console.log('✅ Avance ID:', data.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/practicas/{{practica_id}}/avances",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "datos",
                  "value": "{\"titulo\": \"Avance semana 1\", \"descripcion\": \"Inicio de actividades en la empresa.\"}",
                  "type": "text",
                  "contentType": "application/json"
                }
              ]
            }
          }
        },
        {
          "name": "PASO 16 — Docente comenta avance",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/avances/{{avance_id}}/comentario",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"comentario\": \"Buen inicio. Continúa documentando cada actividad.\"\n}"
            }
          }
        },
        {
          "name": "PASO 17 — Registrar nota docente",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/evaluaciones/docente/practica/{{practica_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"notaDocente\": 4.5,\n  \"observacionesDocente\": \"Excelente desempeño.\"\n}"
            }
          }
        },
        {
          "name": "PASO 18 — Registrar nota tutor",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/evaluaciones/tutor/practica/{{practica_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"notaTutor\": 4.2,\n  \"observacionesTutor\": \"Estudiante comprometido.\"\n}"
            }
          }
        },
        {
          "name": "PASO 19 — Registrar nota final",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/evaluaciones/coordinador/practica/{{practica_id}}",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"notaFinal\": 4.3,\n  \"observacionesFinales\": \"Práctica completada satisfactoriamente.\"\n}"
            }
          }
        },
        {
          "name": "PASO 20 — Enviar encuesta estudiante",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/encuestas/practica/{{practica_id}}/tipo/ESTUDIANTE",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"plantillaId\": 1,\n  \"respuestas\": [\n    { \"preguntaId\": 1,  \"valorEscala\": 5 },\n    { \"preguntaId\": 2,  \"valorEscala\": 4 },\n    { \"preguntaId\": 3,  \"valorEscala\": 5 },\n    { \"preguntaId\": 4,  \"valorEscala\": 4 },\n    { \"preguntaId\": 5,  \"valorEscala\": 5 },\n    { \"preguntaId\": 6,  \"valorEscala\": 4 },\n    { \"preguntaId\": 7,  \"valorEscala\": 5 },\n    { \"preguntaId\": 8,  \"valorEscala\": 5 },\n    { \"preguntaId\": 9,  \"valorEscala\": 4 },\n    { \"preguntaId\": 10, \"valorEscala\": 5 },\n    { \"preguntaId\": 11, \"valorEscala\": 5 },\n    { \"preguntaId\": 12, \"valorEscala\": 4 },\n    { \"preguntaId\": 13, \"valorEscala\": 5 },\n    { \"preguntaId\": 14, \"valorEscala\": 5 }\n  ],\n  \"observaciones\": \"Experiencia muy positiva.\",\n  \"nombreProyecto\": \"Sistema de Gestión de Inventarios\",\n  \"postularProyecto\": true\n}"
            }
          }
        },
        {
          "name": "PASO 21 — Enviar encuesta tutor",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/encuestas/practica/{{practica_id}}/tipo/TUTOR",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type",  "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"plantillaId\": 2,\n  \"respuestas\": [\n    { \"preguntaId\": 15, \"valorEscala\": 5 },\n    { \"preguntaId\": 16, \"valorEscala\": 4 },\n    { \"preguntaId\": 17, \"valorEscala\": 5 },\n    { \"preguntaId\": 18, \"valorEscala\": 4 },\n    { \"preguntaId\": 19, \"valorEscala\": 5 },\n    { \"preguntaId\": 20, \"valorEscala\": 5 },\n    { \"preguntaId\": 21, \"valorEscala\": 4 },\n    { \"preguntaId\": 22, \"valorEscala\": 5 },\n    { \"preguntaId\": 23, \"valorTexto\": \"Estudiante muy comprometido.\" }\n  ],\n  \"observaciones\": \"Excelente desempeño.\"\n}"
            }
          }
        },
        {
          "name": "PASO 22 — Verificar checklist antes del cierre",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/cierre/practica/{{practica_id}}/verificar",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "PASO 23 — Ejecutar cierre formal",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/cierre/practica/{{practica_id}}/ejecutar",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        },
        {
          "name": "PASO 24 — Verificar estado final",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/practicas/{{practica_id}}",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
          }
        }
      ]
    }
  ]
}