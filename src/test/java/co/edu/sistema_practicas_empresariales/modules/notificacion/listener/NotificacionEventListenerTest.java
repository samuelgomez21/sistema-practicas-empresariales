package co.edu.sistema_practicas_empresariales.modules.notificacion.listener;

import co.edu.sistema_practicas_empresariales.modules.cierre.event.CierreFormalEvent;
import co.edu.sistema_practicas_empresariales.modules.cierre.event.RecordatorioEncuestaEvent;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.TutorEmpresarial;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.TutorEmpresarialRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.event.EstudianteRegistradoEvent;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.infraestructura.email.EmailService;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.vacante.event.VacanteAprobadaEvent;
import co.edu.sistema_practicas_empresariales.modules.vacante.event.VacanteCreadaEvent;
import co.edu.sistema_practicas_empresariales.modules.encuesta.model.Encuesta;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;


import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificacionEventListenerTest {

    @Mock private EmailService emailService;
    @Mock private PracticaRepository practicaRepository;
    @Mock private EmpresaRepository empresaRepository;
    @Mock private TutorEmpresarialRepository tutorEmpresarialRepository;

    @InjectMocks
    private NotificacionEventListener listener;

    @Test
    void handleEstudianteRegistradoSendsWelcomeEmail() {
        Usuario usuario = Usuario.builder().email("student@test.com").nombre("Juan").build();
        Estudiante estudiante = Estudiante.builder().usuario(usuario).build();
        EstudianteRegistradoEvent event = new EstudianteRegistradoEvent(this, estudiante);

        listener.handleEstudianteRegistrado(event);

        verify(emailService).enviarCorreo(eq("student@test.com"), contains("Bienvenido"), contains("Juan"));
    }

    @Test
    void handleVacanteCreadaSendsCoordinatorEmail() {
        VacanteCreadaEvent event = new VacanteCreadaEvent(1L, 2L, "Ingeniero de Software");

        listener.handleVacanteCreada(event);

        verify(emailService).enviarCorreo(eq("coordinador@unihumboldt.edu.co"), contains("Nueva Vacante"), contains("Ingeniero de Software"));
    }

    @Test
    void handleVacanteAprobadaSendsCompanyEmail() {
        Empresa empresa = Empresa.builder().contactoPrincipalEmail("company@test.com").razonSocial("ACME Corp").build();
        when(empresaRepository.findById(2L)).thenReturn(Optional.of(empresa));
        VacanteAprobadaEvent event = new VacanteAprobadaEvent(1L, 2L);

        listener.handleVacanteAprobada(event);

        verify(emailService).enviarCorreo(eq("company@test.com"), contains("Aprobada"), contains("ACME Corp"));
    }

    @Test
    void handleCierreFormalSendsEmailsToAllActors() {
        Usuario estudianteUser = Usuario.builder().email("student@test.com").nombre("Juan").build();
        Estudiante estudiante = Estudiante.builder().usuario(estudianteUser).build();
        Usuario docente = Usuario.builder().email("docente@test.com").nombre("Pedro").build();
        TutorEmpresarial tutor = TutorEmpresarial.builder().correo("tutor@test.com").nombreCompleto("Tito").build();
        
        Practica practica = Practica.builder()
                .id(10L)
                .estudiante(estudiante)
                .docenteAsesor(docente)
                .tutorEmpresarialId(5L)
                .numeroPractica(1)
                .notaFinal(BigDecimal.valueOf(4.0))
                .build();

        when(practicaRepository.findById(10L)).thenReturn(Optional.of(practica));
        when(tutorEmpresarialRepository.findById(5L)).thenReturn(Optional.of(tutor));

        CierreFormalEvent event = new CierreFormalEvent(10L, "APROBADO", "coordinador@test.com");

        listener.handleCierreFormal(event);

        verify(emailService).enviarCorreo(eq("student@test.com"), contains("Resultado"), contains("Juan"));
        verify(emailService).enviarCorreo(eq("docente@test.com"), contains("Cierre formal"), contains("Pedro"));
        verify(emailService).enviarCorreo(eq("tutor@test.com"), contains("Finalización"), contains("Tito"));
    }

    @Test
    void handleRecordatorioEncuestaSendsReminderEmail() {
        Usuario estudianteUser = Usuario.builder().email("student@test.com").nombre("Juan").build();
        Estudiante estudiante = Estudiante.builder().usuario(estudianteUser).build();
        TutorEmpresarial tutor = TutorEmpresarial.builder().correo("tutor@test.com").nombreCompleto("Tito").build();

        Practica practica = Practica.builder()
                .id(10L)
                .estudiante(estudiante)
                .tutorEmpresarialId(5L)
                .build();

        when(practicaRepository.findById(10L)).thenReturn(Optional.of(practica));
        when(tutorEmpresarialRepository.findById(5L)).thenReturn(Optional.of(tutor));

        // Estudiante reminder
        listener.handleRecordatorioEncuesta(new RecordatorioEncuestaEvent(10L, Encuesta.TipoActor.ESTUDIANTE));
        verify(emailService).enviarCorreo(eq("student@test.com"), contains("Recordatorio"), contains("Juan"));

        // Tutor reminder
        listener.handleRecordatorioEncuesta(new RecordatorioEncuestaEvent(10L, Encuesta.TipoActor.TUTOR_EMPRESARIAL));
        verify(emailService).enviarCorreo(eq("tutor@test.com"), contains("Recordatorio"), contains("Tito"));
    }
}
