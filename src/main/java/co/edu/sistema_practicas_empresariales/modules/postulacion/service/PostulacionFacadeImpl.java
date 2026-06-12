package co.edu.sistema_practicas_empresariales.modules.postulacion.service;

import co.edu.sistema_practicas_empresariales.modules.postulacion.dto.PostulacionRequestDto;
import co.edu.sistema_practicas_empresariales.modules.postulacion.dto.PostulacionResponseDto;
import co.edu.sistema_practicas_empresariales.modules.postulacion.model.EstadoPostulacionTipo;
import co.edu.sistema_practicas_empresariales.modules.postulacion.model.Postulacion;
import co.edu.sistema_practicas_empresariales.modules.postulacion.repository.PostulacionRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.repository.EstudianteRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostulacionFacadeImpl implements PostulacionFacade {

    private final PostulacionRepository postulacionRepository;
    private final VacanteRepository vacanteRepository;
    private final EstudianteRepository estudianteRepository;

    @Override
    @Transactional
    public PostulacionResponseDto crearPostulacion(PostulacionRequestDto dto) {
        Objects.requireNonNull(dto, "PostulacionRequestDto no puede ser null");

        Vacante vacante = vacanteRepository.findById(dto.getVacanteId())
                .orElseThrow(() -> new IllegalArgumentException("Vacante no encontrada"));

        Estudiante estudiante = estudianteRepository.findById(dto.getEstudianteId())
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado"));

        if (postulacionRepository.findByVacanteIdAndEstudianteId(vacante.getId(), estudiante.getId()).isPresent()) {
            throw new IllegalStateException("El estudiante ya se ha postulado a esta vacante");
        }

        Postulacion postulacion = Postulacion.builder()
                .vacante(vacante)
                .estudiante(estudiante)
                .observaciones(dto.getObservaciones())
                .estado(EstadoPostulacionTipo.POSTULADO)
                .build();

        postulacion = postulacionRepository.save(postulacion);
        return mapToResponse(postulacion);
    }

    @Override
    @Transactional
    public PostulacionResponseDto actualizarEstado(Long id, String estado) {
        Postulacion postulacion = postulacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulacion no encontrada"));

        try {
            EstadoPostulacionTipo nuevoEstado = EstadoPostulacionTipo.valueOf(estado.toUpperCase());
            postulacion.setEstado(nuevoEstado);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado no válido: " + estado);
        }

        postulacion = postulacionRepository.save(postulacion);
        return mapToResponse(postulacion);
    }

    @Override
    @Transactional(readOnly = true)
    public PostulacionResponseDto obtenerPostulacion(Long id) {
        Postulacion postulacion = postulacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulacion no encontrada"));
        return mapToResponse(postulacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostulacionResponseDto> listarTodas() {
        return postulacionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostulacionResponseDto> listarPorVacante(Long vacanteId) {
        return postulacionRepository.findByVacanteId(vacanteId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostulacionResponseDto> listarPorEstudiante(Long estudianteId) {
        return postulacionRepository.findByEstudianteId(estudianteId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarPostulacion(Long id) {
        if (!postulacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Postulacion no encontrada");
        }
        postulacionRepository.deleteById(id);
    }

    private PostulacionResponseDto mapToResponse(Postulacion p) {
        return PostulacionResponseDto.builder()
                .id(p.getId())
                .vacanteId(p.getVacante().getId())
                .tituloVacante(p.getVacante().getTitulo())
                .estudianteId(p.getEstudiante().getId())
                .nombreEstudiante(p.getEstudiante().getUsuario().getNombre())
                .estado(p.getEstado())
                .fechaPostulacion(p.getFechaPostulacion())
                .observaciones(p.getObservaciones())
                .build();
    }
}
