/**
 * Roles del sistema — usados para control de acceso, rutas y menú.
 */
export const ROLES = {
  ADMINISTRADOR:          'ADMINISTRADOR',
  COORDINACION_ACADEMICA: 'COORDINACION_ACADEMICA',
  COORDINADOR_PRACTICA:   'COORDINADOR_PRACTICA',
  SECRETARIA:             'SECRETARIA',
  DOCENTE_ASESOR:         'DOCENTE_ASESOR',
  EMPRESA:                'EMPRESA',
  TUTOR_EMPRESARIAL:      'TUTOR_EMPRESARIAL',
  ESTUDIANTE:             'ESTUDIANTE',
  DIRECCION:              'DIRECCION',
}

/**
 * Ruta de dashboard por rol.
 * Usada después del login y en redirecciones.
 */
export const DASHBOARD_POR_ROL = {
  [ROLES.ADMINISTRADOR]:          '/dashboard/admin',
  [ROLES.COORDINACION_ACADEMICA]: '/dashboard/coordinacion-academica',
  [ROLES.COORDINADOR_PRACTICA]:   '/dashboard/coordinador-practica',
  [ROLES.SECRETARIA]:             '/dashboard/secretaria',
  [ROLES.DOCENTE_ASESOR]:         '/dashboard/docente',
  [ROLES.EMPRESA]:                '/dashboard/empresa',
  [ROLES.TUTOR_EMPRESARIAL]:      '/dashboard/tutor',
  [ROLES.ESTUDIANTE]:             '/dashboard/estudiante',
  [ROLES.DIRECCION]:              '/dashboard/direccion',
}

/**
 * Menú del sidebar por rol.
 * Cada item: { label, icon, path, section }
 * section agrupa visualmente los items en el sidebar.
 */
export const MENU_POR_ROL = {
  [ROLES.ADMINISTRADOR]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'layout-dashboard', path: '/dashboard/admin' },
        { label: 'Usuarios',     icon: 'users',            path: '/admin/usuarios' },
        { label: 'Facultades',   icon: 'school',           path: '/admin/facultades' },
        { label: 'Programas',    icon: 'books',            path: '/admin/programas' },
        { label: 'Configuración', icon: 'settings-2', path: '/configuracion/facultades' },
        { label: 'Usuarios', icon: 'users', path: '/usuarios/coordinadores' },
      ],
    },
    { section: 'Sistema',
      items: [
        { label: 'Plantillas de correo', icon: 'mail-cog',   path: '/admin/plantillas' },
        { label: 'Catálogos',            icon: 'table',      path: '/admin/catalogos' },
        { label: 'Bitácora',             icon: 'list-search', path: '/admin/bitacora' },
      ],
    },
    { section: 'Practicas',
      items: [
        { label: 'Vacantes', icon: 'briefcase', path: '/vacantes/listado' },
      ],
    },
  ],

  [ROLES.COORDINACION_ACADEMICA]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'layout-dashboard', path: '/dashboard/coordinacion-academica' },
        { label: 'Estudiantes',       icon: 'school',       path: '/usuarios/estudiantes' },
        { label: 'Docentes asesores', icon: 'chalkboard',   path: '/usuarios/docentes' },
        { label: 'Configuración', icon: 'settings-2', path: '/configuracion/facultades' },
        
        
      ],
    },
    { section: 'Gestión',
      items: [
        { label: 'Clasificación',  icon: 'clipboard-check', path: '/coordinacion/clasificacion' },
        { label: 'Carga docentes', icon: 'users',            path: '/coordinacion/docentes'      },
      ],
    },
  ],

  [ROLES.COORDINADOR_PRACTICA]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'layout-dashboard', path: '/dashboard/coordinador-practica' },
        { label: 'Empresas',    icon: 'building',    path: '/empresas/listado' },
        { label: 'Vacantes', icon: 'briefcase', path: '/vacantes/listado' },
        { label: 'Estudiantes',  icon: 'users',            path: '/practica/estudiantes' },
        { label: 'Asignaciones', icon: 'transfer',         path: '/practica/asignaciones' },
        { label: 'Configuración', icon: 'settings-2', path: '/configuracion/facultades' },
        
      ],
    },
    { section: 'Seguimiento',
      items: [
        { label: 'Prácticas activas', icon: 'clipboard-list', path: '/practica/activas' },
        { label: 'Reportes',          icon: 'chart-bar',       path: '/practica/reportes' },
        { label: 'Visitas',     icon: 'map-pin',     path: '/empresas/visitas' },
      ],
    },
  ],

  [ROLES.SECRETARIA]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'layout-dashboard', path: '/dashboard/secretaria' },
        { label: 'Empresas',    icon: 'building',    path: '/empresas/listado' },
        { label: 'Vacantes', icon: 'briefcase', path: '/vacantes/listado' },
        { label: 'Estudiantes',  icon: 'users',            path: '/secretaria/estudiantes' },
        { label: 'Asignaciones', icon: 'transfer',         path: '/secretaria/asignaciones' },
        { label: 'Visitas',     icon: 'map-pin',     path: '/empresas/visitas' },
      ],
    },
    { section: 'Seguimiento',
      items: [
        { label: 'Prácticas activas', icon: 'clipboard-list', path: '/secretaria/activas' },
      ],
    },
  ],

  [ROLES.DOCENTE_ASESOR]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',   icon: 'layout-dashboard', path: '/dashboard/docente' },
        { label: 'Mis estudiantes', icon: 'users',        path: '/docente/estudiantes' },
      ],
    },
    { section: 'Seguimiento',
      items: [
        { label: 'Seguimiento', icon: 'clipboard-list',   path: '/docente/seguimiento' },
        { label: 'Visitas',     icon: 'map-pin',          path: '/docente/visitas' },
        { label: 'Evaluaciones', icon: 'star',            path: '/docente/evaluaciones' },
      ],
    },
  ],

  [ROLES.EMPRESA]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',  icon: 'layout-dashboard', path: '/dashboard/empresa' },
        { label: 'Mi perfil',  icon: 'building',         path: '/empresas/mi-perfil' },
        { label: 'Practicantes',   icon: 'users',        path: '/empresas/practicantes' },
        
      ],
    },
    { section: 'Gestión',
      items: [
        { label: 'Mis vacantes', icon: 'briefcase', path: '/vacantes/mis-vacantes' },  
        { label: 'Candidatos', icon: 'users', path: '/empresas/candidatos' },        
        { label: 'Tutores',        icon: 'user-check',   path: '/empresas/tutores' },
      ],
    },
  ],

  [ROLES.TUTOR_EMPRESARIAL]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',       icon: 'layout-dashboard', path: '/dashboard/tutor' },
        { label: 'Mis estudiantes', icon: 'users',            path: '/tutor/estudiantes' },
        { label: 'Encuestas',       icon: 'forms',            path: '/tutor/encuestas' },
      ],
    },
  ],

  [ROLES.ESTUDIANTE]: [
    { section: 'Mi espacio',
      items: [
        { label: 'Dashboard',   icon: 'layout-dashboard', path: '/estudiante/dashboard' },
        { label: 'Mi práctica', icon: 'briefcase',         path: '/estudiante/practica'  },
        { label: 'Mi perfil',   icon: 'user',              path: '/estudiante/perfil'    },
        { label: 'Documentos',  icon: 'file',              path: '/estudiante/documentos'},
      ],
    },
    { section: 'Seguimiento',
      items: [
        { label: 'Avances',    icon: 'clipboard-list',  path: '/estudiante/avances'   },
        { label: 'Encuestas',  icon: 'forms',           path: '/estudiante/encuestas' },
        { label: 'Paz y salvo', icon: 'shield-check',   path: '/estudiante/paz-salvo' },
        { label: 'Mis postulaciones', icon: 'send', path: '/estudiante/postulaciones' },
      ],
    },
  ],

  [ROLES.DIRECCION]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',  icon: 'layout-dashboard', path: '/dashboard/direccion' },
        { label: 'Reportes',   icon: 'chart-bar',        path: '/direccion/reportes' },
        { label: 'Indicadores', icon: 'chart-line',      path: '/direccion/indicadores' },
        { label: 'Empresas',   icon: 'building',         path: '/direccion/empresas' },
      ],
    },
  ],
}