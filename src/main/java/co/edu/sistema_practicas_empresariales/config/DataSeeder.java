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

        Rol rolEmpresa = rolRepository.findByNombre(Rol.Nombre.EMPRESA_VINCULADA)
                .orElseGet(() -> rolRepository.save(Rol.builder().nombre(Rol.Nombre.EMPRESA_VINCULADA).build()));

        // Mapear Facultad y Programa con SQL directo para asegurar que el Programa ID 1 exista
        try {
            jdbcTemplate.execute("MERGE INTO facultades (id, nombre, activo, fecha_creacion) VALUES (1, 'Ingenieria', true, CURRENT_TIMESTAMP)");
            jdbcTemplate.execute("MERGE INTO programas (id, nombre, facultad_id, activo, fecha_creacion) VALUES (1, 'Ingenieria de Sistemas', 1, true, CURRENT_TIMESTAMP)");
        } catch(Exception e) {
            System.err.println("Error insertando Facultad/Programa: " + e.getMessage());
        }


        // Crear un usuario para la empresa
        Usuario usuarioEmpresa = Usuario.builder()
                .email("contacto@empresa.com")
                .password(passwordEncoder.encode("12345"))
                .nombre("Contacto Empresa")
                .rol(rolEmpresa)
                .build();
        usuarioRepository.save(usuarioEmpresa);

        // Crear una empresa de prueba
        Empresa empresa = Empresa.builder()
                .usuario(usuarioEmpresa)
                .nit("900123456-7")
                .razonSocial("Empresa Tech S.A.")
                .contactoPrincipalEmail("contacto@empresa.com")
                .build();
        empresaRepository.save(empresa);

        // Crear un estudiante de prueba
        Usuario estudiante = Usuario.builder()
                .email("estudiante@universidad.edu.co")
                .password(passwordEncoder.encode("12345"))
                .nombre("Estudiante de Prueba")
                .rol(rolEstudiante)
                .build();
        usuarioRepository.save(estudiante);

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
        vacanteRepository.save(vacante);

        // Sembrar datos dependientes usando JdbcTemplate para asegurar que los IDs 1 existan para las pruebas en Postman
        try {
            // Tutor Empresarial (ID 1, usuario_id 1 que es empresa, empresa_id 1)
            jdbcTemplate.execute("MERGE INTO tutores_empresariales (id, cargo, empresa_id, usuario_id, activo, fecha_creacion) VALUES (1, 'Tutor Principal', 1, 1, true, CURRENT_TIMESTAMP)");
            
            // Postulacion (ID 1, estudiante_id 2, vacante_id 1)
            jdbcTemplate.execute("MERGE INTO postulaciones (id, estado, fecha_postulacion, estudiante_id, vacante_id, activo, fecha_creacion) VALUES (1, 'PENDIENTE', CURRENT_TIMESTAMP, 2, 1, true, CURRENT_TIMESTAMP)");
            
            // Vinculacion (ID 1, postulacion 1, tutor 1)
            jdbcTemplate.execute("MERGE INTO vinculaciones (id, estado, fecha_fin, fecha_inicio, postulacion_id, tutor_empresarial_id, activo, fecha_creacion) VALUES (1, 'ACTIVA', '2026-12-31', '2026-06-01', 1, 1, true, CURRENT_TIMESTAMP)");
            
            // Documento (ID 1, vinculacion 1)
            jdbcTemplate.execute("MERGE INTO documentos (id, estado, fecha_subida, observaciones, tipo_documento, url_archivo, vinculacion_id, activo) VALUES (1, 'APROBADO', CURRENT_TIMESTAMP, 'Validado', 'PLAN_TRABAJO', 'http://ejemplo.com', 1, true)");
        } catch(Exception e) {
            System.err.println("Error insertando dependencias (Tutor/Postulacion/Vinculacion/Doc): " + e.getMessage());
        }
    }
}
