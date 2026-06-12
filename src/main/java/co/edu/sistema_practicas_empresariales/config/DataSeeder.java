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
        if (empresaRepository.count() > 0) {
            return;
        }

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

        // Crear Coordinador
        if (usuarioRepository.findByEmail("coordinador@universidad.edu.co").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .email("coordinador@universidad.edu.co")
                    .password(passwordEncoder.encode("coord123"))
                    .nombre("Coordinador de Practicas")
                    .rol(rolCoordinador)
                    .build());
        }

        // Crear Docente
        if (usuarioRepository.findByEmail("docente@universidad.edu.co").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .email("docente@universidad.edu.co")
                    .password(passwordEncoder.encode("docente123"))
                    .nombre("Docente Asesor")
                    .rol(rolDocente)
                    .build());
        }

        // Crear un usuario para la empresa
        Usuario usuarioEmpresa;
        if (usuarioRepository.findByEmail("contacto@empresa.com").isEmpty()) {
            usuarioEmpresa = Usuario.builder()
                    .email("contacto@empresa.com")
                    .password(passwordEncoder.encode("12345"))
                    .nombre("Contacto Empresa")
                    .rol(rolEmpresa)
                    .build();
            usuarioEmpresa = usuarioRepository.save(usuarioEmpresa);
        } else {
            usuarioEmpresa = usuarioRepository.findByEmail("contacto@empresa.com").get();
        }

        // Crear una empresa de prueba
        Empresa empresa = Empresa.builder()
                .usuario(usuarioEmpresa)
                .nit("900123456-7")
                .razonSocial("Empresa Tech S.A.")
                .contactoPrincipalEmail("contacto@empresa.com")
                .build();
        empresa = empresaRepository.save(empresa);

        // Crear un estudiante de prueba
        Usuario estudiante;
        if (usuarioRepository.findByEmail("estudiante@universidad.edu.co").isEmpty()) {
            estudiante = Usuario.builder()
                    .email("estudiante@universidad.edu.co")
                    .password(passwordEncoder.encode("12345"))
                    .nombre("Estudiante de Prueba")
                    .rol(rolEstudiante)
                    .build();
            estudiante = usuarioRepository.save(estudiante);
        } else {
            estudiante = usuarioRepository.findByEmail("estudiante@universidad.edu.co").get();
        }

        // Crear una vacante de prueba
        Vacante vacante = Vacante.builder()
                .empresa(empresa)
                .titulo("Desarrollador Junior Java")
                .descripcion("Apoyo en el desarrollo de microservicios")
                .perfilRequerido("Estudiante de 8vo semestre en adelante")
                .requisitos("Conocimientos en Java y Spring Boot")
                .cuposTotales(3)
                .cuposDisponibles(3)
                .estado(EstadoVacanteTipo.PENDIENTE)
                .build();
        vacante = vacanteRepository.save(vacante);

        // Sembrar datos dependientes de forma agnóstica a la base de datos
        try {
            Long empresaId = empresa.getId();
            Long usuarioEmpresaId = usuarioEmpresa.getId();
            Long estudianteId = estudiante.getId();
            Long vacanteId = vacante.getId();

            // Tutor Empresarial 
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM tutores_empresariales WHERE id = 1", Integer.class) == 0) {
                jdbcTemplate.execute(String.format(
                    "INSERT INTO tutores_empresariales (id, cargo, empresa_id, usuario_id, activo, fecha_creacion, correo, telefono, nombre_completo) VALUES (1, 'Tutor Principal', %d, %d, true, CURRENT_TIMESTAMP, 'tutor@empresa.com', '123456789', 'Juan Tutor')",
                    empresaId, usuarioEmpresaId));
            }
            
            // Postulacion 
            if (jdbcTemplate.queryForObject("SELECT count(*) FROM postulaciones WHERE id = 1", Integer.class) == 0) {
                jdbcTemplate.execute(String.format(
                    "INSERT INTO postulaciones (id, estado, fecha_postulacion, usuario_id, vacante_id, eliminado) VALUES (1, 'PENDIENTE', CURRENT_TIMESTAMP, %d, %d, false)",
                    estudianteId, vacanteId));
            }
            
        } catch(Exception e) {
            System.err.println("Error insertando dependencias (Tutor/Postulacion): " + e.getMessage());
        }
    }
}
