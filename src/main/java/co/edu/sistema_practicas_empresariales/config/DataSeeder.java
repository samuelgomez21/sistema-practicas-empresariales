package co.edu.sistema_practicas_empresariales.config;


import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final EmpresaRepository empresaRepository;
    private final VacanteRepository vacanteRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Se removió el check if (empresaRepository.count() > 0) para que ejecute la inyección

        // Crear rol Estudiante y Empresa si no existen
        Rol rolEstudiante = rolRepository.findByNombre(Rol.Nombre.ESTUDIANTE)
                .orElseGet(() -> rolRepository.save(Rol.builder().nombre(Rol.Nombre.ESTUDIANTE).build()));

        Rol rolEmpresa = rolRepository.findByNombre(Rol.Nombre.TUTOR_EMPRESARIAL)
                .orElseGet(() -> rolRepository.save(Rol.builder().nombre(Rol.Nombre.TUTOR_EMPRESARIAL).build()));

        Rol rolAdmin = rolRepository.findByNombre(Rol.Nombre.ADMINISTRADOR)
                .orElseGet(() -> rolRepository.save(Rol.builder().nombre(Rol.Nombre.ADMINISTRADOR).build()));

        Rol rolCoordinador = rolRepository.findByNombre(Rol.Nombre.COORDINADOR_PRACTICA)
                .orElseGet(() -> rolRepository.save(Rol.builder().nombre(Rol.Nombre.COORDINADOR_PRACTICA).build()));

        Rol rolDocente = rolRepository.findByNombre(Rol.Nombre.DOCENTE_ASESOR)
                .orElseGet(() -> rolRepository.save(Rol.builder().nombre(Rol.Nombre.DOCENTE_ASESOR).build()));

        // Mapear Facultad y Programa de forma agnóstica a la base de datos
        try {
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM facultades WHERE id = 1", Integer.class) == 0) {
                jdbcTemplate.execute("INSERT INTO facultades (id, nombre, activo, fecha_creacion) VALUES (1, 'Ingenieria', true, CURRENT_TIMESTAMP)");
            }
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM programas WHERE id = 1", Integer.class) == 0) {
                jdbcTemplate.execute("INSERT INTO programas (id, nombre, facultad_id, activo, fecha_creacion) VALUES (1, 'Ingenieria de Sistemas', 1, true, CURRENT_TIMESTAMP)");
            }
        } catch(Exception e) {
            System.err.println("Error insertando Facultad/Programa: " + e.getMessage());
        }

        // Crear Administrador
        if (usuarioRepository.findByEmail("admin@universidad.edu.co").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .email("admin@universidad.edu.co")
                    .password(passwordEncoder.encode("admin123"))
                    .nombre("Super Administrador")
                    .rol(rolAdmin)
                    .build());
        }

        // LIMPIAR USUARIOS DE PRUEBA
        try {
            jdbcTemplate.execute("UPDATE usuarios SET activo=false, eliminado=true WHERE email IN ('coordinador@universidad.edu.co', 'docente@universidad.edu.co', 'contacto@empresa.com', 'admin@sistema.com', 'coordinador_academico@universidad.edu.co', 'empresa@universidad.edu.co')");
            jdbcTemplate.execute("UPDATE programas SET activo=false WHERE nombre LIKE '%Sistemas%'");
        } catch(Exception e) {
            System.err.println("Error limpiando datos de prueba: " + e.getMessage());
        }

        // FACULTADES
        Long facIngId = 1L;
        Long facAdmId = 2L;
        Long facTurId = 3L;

        try {
            // Ingeniería ya existe (ID=1)
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM facultades WHERE id = 1", Integer.class) == 0) {
                jdbcTemplate.execute("INSERT INTO facultades (id, nombre, activo, fecha_creacion) VALUES (1, 'Facultad de Ingeniería', true, CURRENT_TIMESTAMP)");
            }
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM facultades WHERE id = 2", Integer.class) == 0) {
                jdbcTemplate.execute("INSERT INTO facultades (id, nombre, activo, fecha_creacion) VALUES (2, 'Facultad de Ciencias Administrativas', true, CURRENT_TIMESTAMP)");
            }
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM facultades WHERE id = 3", Integer.class) == 0) {
                jdbcTemplate.execute("INSERT INTO facultades (id, nombre, activo, fecha_creacion) VALUES (3, 'Facultad de Turismo', true, CURRENT_TIMESTAMP)");
            }
        } catch(Exception e) {
            System.err.println("Error insertando Facultades: " + e.getMessage());
        }

        // PROGRAMAS DUALES
        Long progIndId = 2L;
        Long progSoftId = 3L;
        Long progAdmId = 4L;
        Long progTurId = 5L;

        try {
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM programas WHERE id = 2", Integer.class) == 0) {
                jdbcTemplate.execute("INSERT INTO programas (id, nombre, facultad_id, activo, fecha_creacion) VALUES (2, 'Ingeniería Industrial (Dual)', 1, true, CURRENT_TIMESTAMP)");
            }
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM programas WHERE id = 3", Integer.class) == 0) {
                jdbcTemplate.execute("INSERT INTO programas (id, nombre, facultad_id, activo, fecha_creacion) VALUES (3, 'Ingeniería de Software (Dual)', 1, true, CURRENT_TIMESTAMP)");
            }
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM programas WHERE id = 4", Integer.class) == 0) {
                jdbcTemplate.execute("INSERT INTO programas (id, nombre, facultad_id, activo, fecha_creacion) VALUES (4, 'Administración de Empresas (Dual)', 2, true, CURRENT_TIMESTAMP)");
            }
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM programas WHERE id = 5", Integer.class) == 0) {
                jdbcTemplate.execute("INSERT INTO programas (id, nombre, facultad_id, activo, fecha_creacion) VALUES (5, 'Turismo (Dual)', 3, true, CURRENT_TIMESTAMP)");
            }
        } catch(Exception e) {
            System.err.println("Error insertando Programas: " + e.getMessage());
        }

        // COORDINADORES DE PRACTICA (FACULTAD)
        crearUsuarioConScope("coord.ingenieria@cue.edu.co", "CUE2026*", "Coordinador Prácticas Ingeniería", rolCoordinador, "FACULTAD", String.valueOf(facIngId));
        crearUsuarioConScope("coord.administracion@cue.edu.co", "CUE2026*", "Coordinador Prácticas Administración", rolCoordinador, "FACULTAD", String.valueOf(facAdmId));
        crearUsuarioConScope("coord.turismo@cue.edu.co", "CUE2026*", "Coordinador Prácticas Turismo", rolCoordinador, "FACULTAD", String.valueOf(facTurId));

        // COORDINADORES ACADEMICOS (PROGRAMA)
        Rol rolAcad = rolRepository.findByNombre(Rol.Nombre.COORDINADOR_ACADEMICO).orElseGet(() -> rolRepository.save(Rol.builder().nombre(Rol.Nombre.COORDINADOR_ACADEMICO).build()));
        
        Usuario uInd = crearUsuarioConScope("academico.industrial@cue.edu.co", "CUE2026*", "Coord. Académico Industrial", rolAcad, "PROGRAMA", String.valueOf(progIndId));
        Usuario uSoft = crearUsuarioConScope("academico.software@cue.edu.co", "CUE2026*", "Coord. Académico Software", rolAcad, "PROGRAMA", String.valueOf(progSoftId));
        Usuario uAdm = crearUsuarioConScope("academico.administracion@cue.edu.co", "CUE2026*", "Coord. Académico Administración", rolAcad, "PROGRAMA", String.valueOf(progAdmId));
        Usuario uTur = crearUsuarioConScope("academico.turismo@cue.edu.co", "CUE2026*", "Coord. Académico Turismo", rolAcad, "PROGRAMA", String.valueOf(progTurId));

        // ASIGNAR PROGRAMAS A COORDINADORES ACADEMICOS EN TABLA INTERMEDIA
        asignarProgramaACoordinador(uInd.getId(), progIndId);
        asignarProgramaACoordinador(uSoft.getId(), progSoftId);
        asignarProgramaACoordinador(uAdm.getId(), progAdmId);
        asignarProgramaACoordinador(uTur.getId(), progTurId);

    }

    private Usuario crearUsuarioConScope(String email, String password, String nombre, Rol rol, String scopeTipo, String scopeValorId) {
        if (usuarioRepository.findByEmail(email).isEmpty()) {
            Usuario u = Usuario.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .nombre(nombre)
                    .rol(rol)
                    .build();
            Usuario saved = usuarioRepository.save(u);
            try {
                jdbcTemplate.execute(String.format("UPDATE usuarios SET scope_tipo='%s', scope_valor_id='%s', debe_cambiar_password=true WHERE id=%d", scopeTipo, scopeValorId, saved.getId()));
            } catch(Exception e) {
                 System.err.println("Error actualizando scope: " + e.getMessage());
            }
            return saved;
        }
        return usuarioRepository.findByEmail(email).get();
    }

    private void asignarProgramaACoordinador(Long usuarioId, Long programaId) {
        try {
            if (jdbcTemplate.queryForObject(String.format("SELECT count(*) FROM coordinador_programas WHERE usuario_id=%d AND programa_id=%d", usuarioId, programaId), Integer.class) == 0) {
                jdbcTemplate.execute(String.format("INSERT INTO coordinador_programas (usuario_id, programa_id) VALUES (%d, %d)", usuarioId, programaId));
            }
        } catch(Exception e) {
             System.err.println("Error asignando programa a coordinador: " + e.getMessage());
        }
    }
}
