package co.edu.sistema_practicas_empresariales.modules.practica.service;

import co.edu.sistema_practicas_empresariales.modules.practica.dto.*;
import co.edu.sistema_practicas_empresariales.modules.practica.request.FechaSustentacionRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.request.NotaFinalRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PracticaFacade {
    
    // Listados y consultas
    List<PracticaResumenDto> listarTodas();
    List<PracticaResumenDto> listarPorEstado(EstadoPracticaTipo estado);
    List<PracticaResumenDto> listarPorDocente(Long docenteId);
    PracticaDetalleDto obtenerPracticaActivaEstudiante(Long estudianteId);
    PracticaDetalleDto obtenerDetalle(Long practicaId);
    
    // Creación
    PracticaDetalleDto crearPracticaAutomatica(Long estudianteId, Long catalogoId);
    
    // Transiciones de Estado (State Pattern)
    PracticaDetalleDto iniciarVinculacion(Long practicaId);
    PracticaDetalleDto registrarConvenio(Long practicaId);
    PracticaDetalleDto activarPractica(Long practicaId);
    PracticaDetalleDto cancelar(Long practicaId, String motivo);
    
    // Asignaciones
    PracticaDetalleDto asignarDocente(Long practicaId, Long docenteId);
    PracticaDetalleDto asignarEmpresa(Long practicaId, Long empresaId);
    PracticaDetalleDto asignarTutor(Long practicaId, Long tutorId);
    
    // Ejecución y Cierre
    PracticaDetalleDto registrarFechaSustentacion(Long practicaId, FechaSustentacionRequest req);
    PracticaDetalleDto registrarNotaFinal(Long practicaId, NotaFinalRequest req);
    
    // Documentos
    PracticaDetalleDto subirDocumento(Long practicaId, String categoria, MultipartFile archivo, String subidoPor);
    
    // Checklist
    List<ChecklistDto> obtenerChecklist(Long practicaId);
    boolean tienePazYSalvo(Long practicaId);
    
    // Generación de Documentos Formales (Builder Pattern)
    co.edu.sistema_practicas_empresariales.modules.documento.builder.ActaCierre generarActaCierre(Long practicaId);
    
    // Borrado lógico
    void eliminarPractica(Long practicaId);
}
