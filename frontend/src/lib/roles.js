/**
 * Roles del sistema — usados para control de acceso, rutas y menú.
 */
export const ROLES = {
  ADMINISTRADOR:           'ADMINISTRADOR',
  COORDINADOR_ACADEMICO:   'COORDINADOR_ACADEMICO',
  COORDINADOR_PRACTICA:    'COORDINADOR_PRACTICA',
  SECRETARIA_COORDINACION: 'SECRETARIA_COORDINACION',
  DOCENTE_ASESOR:          'DOCENTE_ASESOR',
  EMPRESA_VINCULADA:       'EMPRESA_VINCULADA',
  TUTOR_EMPRESARIAL:       'TUTOR_EMPRESARIAL',
  ESTUDIANTE:              'ESTUDIANTE',
  DIRECCION:               'DIRECCION',
}

/**
 * Ruta de dashboard por rol.
 * Usada después del login y en redirecciones.
 */
export const DASHBOARD_POR_ROL = {
  [ROLES.ADMINISTRADOR]:           '/dashboard/admin',
  [ROLES.COORDINADOR_ACADEMICO]:   '/dashboard/coordinacion-academica',
  [ROLES.COORDINADOR_PRACTICA]:    '/dashboard/coordinador-practica',
  [ROLES.SECRETARIA_COORDINACION]: '/dashboard/secretaria',
  [ROLES.DOCENTE_ASESOR]:          '/dashboard/docente',
  [ROLES.EMPRESA_VINCULADA]:       '/dashboard/empresa',
  [ROLES.TUTOR_EMPRESARIAL]:       '/dashboard/tutor',
  [ROLES.ESTUDIANTE]:              '/dashboard/estudiante',
  [ROLES.DIRECCION]:               '/dashboard/direccion',
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
        { label: 'Dashboard', icon: 'layout-dashboard', path: '/dashboard/admin' },
        { label: 'Usuarios',  icon: 'users',            path: '/admin/usuarios'  },
      ],
    },
    { section: 'Sistema',
      items: [
        { label: 'Configuración', icon: 'settings-2', path: '/configuracion/facultades' },
        { label: 'Bitácora',      icon: 'history',    path: '/admin/bitacora'  },
      ],
    },
    { section: 'Practicas',
      items: [
        { label: 'Vacantes', icon: 'briefcase', path: '/vacantes/listado' },
      ],
    },
  ],

  [ROLES.COORDINADOR_ACADEMICO]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',         icon: 'layout-dashboard', path: '/dashboard/coordinacion-academica' },
        { label: 'Estudiantes',       icon: 'school',           path: '/usuarios/estudiantes' },
        { label: 'Docentes asesores', icon: 'chalkboard',       path: '/usuarios/docentes' },
        { label: 'Configuración',     icon: 'settings-2',       path: '/configuracion/facultades' },
      ],
    },
    { section: 'Gestión',
      items: [
        { label: 'Clasificación',  icon: 'clipboard-check', path: '/coordinacion/clasificacion' },
        { label: 'Carga docentes', icon: 'users',           path: '/coordinacion/docentes'      },
      ],
    },
  ],

  [ROLES.COORDINADOR_PRACTICA]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',   icon: 'layout-dashboard', path: '/dashboard/coordinador-practica' },
        { label: 'Empresas',    icon: 'building',         path: '/empresas/listado' },
        { label: 'Vacantes',    icon: 'briefcase',        path: '/vacantes/listado' },
        { label: 'Estudiantes', icon: 'graduation-cap',   path: '/coordinacion-empresarial/estudiantes' },
      ],
    },
    { section: 'Seguimiento',
      items: [
        { label: 'Prácticas activas', icon: 'clipboard-list', path: '/coordinacion-empresarial/practicas' },
        { label: 'Reportes',          icon: 'chart-bar',      path: '/coordinacion-empresarial/reportes' },
        { label: 'Visitas',           icon: 'map-pin',        path: '/coordinacion-empresarial/visitas'   },
        { label: 'Paz y Salvo',       icon: 'award',          path: '/coordinacion-empresarial/paz-salvo' },
        {label: 'Historial Practicas', icon: '', path:'coordinacion-empresarial/historial' }
      ],
    },
    { section: 'Gestion',
      items: [
        { label: 'Contratos',     icon: 'file-text', path: '/coordinacion-empresarial/contratos' },
        { label: 'Configuración', icon: 'settings-2', path: '/configuracion/facultades' },
        { label: 'Encuestas', icon: '', path: '/coordinacion-empresarial/encuestas' },
      ],
    },
  ],

  [ROLES.SECRETARIA_COORDINACION]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'layout-dashboard', path: '/dashboard/secretaria' },
        { label: 'Empresas',     icon: 'building',         path: '/empresas/listado' },
        { label: 'Vacantes',     icon: 'briefcase',        path: '/vacantes/listado' },
        { label: 'Estudiantes',  icon: 'users',            path: '/secretaria/estudiantes' },
        { label: 'Asignaciones', icon: 'transfer',         path: '/secretaria/asignaciones' },
        { label: 'Visitas',      icon: 'map-pin',          path: '/empresas/visitas' },
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
        { label: 'Mi Perfil',       icon: 'user',             path: '/docente/perfil' },
        { label: 'Dashboard',       icon: 'layout-dashboard', path: '/dashboard/docente' },
        { label: 'Mis Estudiantes', icon: 'users',            path: '/docente/estudiantes'  },
      ],
    },
    { section: 'Seguimiento',
      items: [
        { label: 'Seguimientos', icon: 'clipboard-list', path: '/docente/seguimientos' },
        { label: 'Visitas',      icon: 'map-pin',        path: '/docente/visitas' },
        // { label: 'Evaluaciones', icon: 'star',           path: '/docente/evaluaciones' },
      ],
    },
  ],

  [ROLES.EMPRESA_VINCULADA]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'layout-dashboard', path: '/dashboard/empresa' },
        { label: 'Mi perfil',    icon: 'building',         path: '/empresas/mi-perfil' },
        { label: 'Practicantes', icon: 'users',            path: '/empresas/practicantes' },
      ],
    },
    { section: 'Gestión',
      items: [
        { label: 'Mis vacantes', icon: 'briefcase',  path: '/vacantes/mis-vacantes' },
        { label: 'Candidatos',   icon: 'users',      path: '/empresas/candidatos' },
        { label: 'Tutores',      icon: 'user-check', path: '/empresas/tutores' },
      ],
    },
  ],

  [ROLES.TUTOR_EMPRESARIAL]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',       icon: 'layout-dashboard', path: '/dashboard/tutor' },
        { label: 'Mi Perfil',       icon: 'user',             path: '/tutor/perfil'      },
        { label: 'Mis Estudiantes', icon: 'users',            path: '/tutor/estudiantes' },
      ],
    },
  ],

  [ROLES.ESTUDIANTE]: [
    { section: 'Mi espacio',
      items: [
        { label: 'Dashboard',   icon: 'layout-dashboard', path: '/estudiante/dashboard' },
        { label: 'Mi práctica', icon: 'briefcase',        path: '/estudiante/practica'  },
        { label: 'Mi perfil',   icon: 'user',             path: '/estudiante/perfil'    },
        { label: 'Documentos',  icon: 'file',             path: '/estudiante/documentos'},
      ],
    },
    { section: 'Seguimiento',
      items: [
        { label: 'Avances',           icon: 'clipboard-list', path: '/estudiante/avances'   },
        { label: 'Encuestas',         icon: 'forms',          path: '/estudiante/encuestas' },
        { label: 'Paz y salvo',       icon: 'shield-check',   path: '/estudiante/paz-salvo' },
        { label: 'Mis postulaciones', icon: 'send',           path: '/estudiante/postulaciones' },
        { label: 'Mi Historial', icon: '',           path: '/estudiante/historial' },
      ],
    },
  ],

  [ROLES.DIRECCION]: [
    { section: 'Principal',
      items: [
        { label: 'Dashboard',   icon: 'layout-dashboard', path: '/dashboard/direccion' },
/*         { label: 'Reportes',    icon: 'chart-bar',        path: '/direccion/reportes' },
        { label: 'Indicadores', icon: 'chart-line',       path: '/direccion/indicadores' },
        { label: 'Empresas',    icon: 'building',         path: '/direccion/empresas' }, */
      ],
    },
  ],
}