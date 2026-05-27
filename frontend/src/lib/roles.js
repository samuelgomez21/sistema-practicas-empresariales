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
      ],
    },
    { section: 'Sistema',
      items: [
        { label: 'Plantillas de correo', icon: 'mail-cog',   path: '/admin/plantillas' },
        { label: 'Catálogos',            icon: 'table',      path: '/admin/catalogos' },
        { label: 'Bitácora',             icon: 'list-search', path: '/admin/bitacora' },
      ],
    },
  ],

  [ROLES.COORDINACION_ACADEMICA]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'layout-dashboard', path: '/dashboard/coordinacion-academica' },
        { label: 'Estudiantes',  icon: 'users',            path: '/academica/estudiantes' },
        { label: 'Docentes',     icon: 'school',           path: '/academica/docentes' },
        { label: 'Catálogo de prácticas', icon: 'books',   path: '/academica/catalogo' },
      ],
    },
    { section: 'Gestión',
      items: [
        { label: 'Validar aptitud',  icon: 'clipboard-check', path: '/academica/aptitud' },
        { label: 'Asignación docente', icon: 'user-check',    path: '/academica/asignacion-docente' },
      ],
    },
  ],

  [ROLES.COORDINADOR_PRACTICA]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'layout-dashboard', path: '/dashboard/coordinador-practica' },
        { label: 'Empresas',     icon: 'building',         path: '/practica/empresas' },
        { label: 'Vacantes',     icon: 'briefcase',        path: '/practica/vacantes' },
        { label: 'Estudiantes',  icon: 'users',            path: '/practica/estudiantes' },
        { label: 'Asignaciones', icon: 'transfer',         path: '/practica/asignaciones' },
      ],
    },
    { section: 'Seguimiento',
      items: [
        { label: 'Prácticas activas', icon: 'clipboard-list', path: '/practica/activas' },
        { label: 'Reportes',          icon: 'chart-bar',       path: '/practica/reportes' },
      ],
    },
  ],

  [ROLES.SECRETARIA]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'layout-dashboard', path: '/dashboard/secretaria' },
        { label: 'Empresas',     icon: 'building',         path: '/secretaria/empresas' },
        { label: 'Vacantes',     icon: 'briefcase',        path: '/secretaria/vacantes' },
        { label: 'Estudiantes',  icon: 'users',            path: '/secretaria/estudiantes' },
        { label: 'Asignaciones', icon: 'transfer',         path: '/secretaria/asignaciones' },
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
        { label: 'Mi perfil',  icon: 'building',         path: '/empresa/perfil' },
        { label: 'Vacantes',   icon: 'briefcase',        path: '/empresa/vacantes' },
        { label: 'Practicantes', icon: 'users',          path: '/empresa/practicantes' },
      ],
    },
    { section: 'Gestión',
      items: [
        { label: 'Documentos', icon: 'file',             path: '/empresa/documentos' },
        { label: 'Tutores',    icon: 'user-check',       path: '/empresa/tutores' },
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
    { section: 'Principal',
      items: [
        { label: 'Dashboard',   icon: 'layout-dashboard', path: '/dashboard/estudiante' },
        { label: 'Mi práctica', icon: 'briefcase',        path: '/estudiante/practica' },
        { label: 'Mi perfil',   icon: 'user',             path: '/estudiante/perfil' },
        { label: 'Documentos',  icon: 'file',             path: '/estudiante/documentos' },
      ],
    },
    { section: 'Seguimiento',
      items: [
        { label: 'Avances',    icon: 'clipboard-list',   path: '/estudiante/avances' },
        { label: 'Encuestas',  icon: 'forms',            path: '/estudiante/encuestas' },
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