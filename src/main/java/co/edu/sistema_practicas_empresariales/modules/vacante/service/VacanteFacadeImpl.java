package co.edu.sistema_practicas_empresariales.modules.vacante.service;

import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteRequest;
import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteResponse;
import co.edu.sistema_practicas_empresariales.modules.vacante.event.VacanteAprobadaEvent;
import co.edu.sistema_practicas_empresariales.modules.vacante.event.VacanteCreadaEvent;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteResolver;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VacanteFacadeImpl implements VacanteFacade {

    private static final String VACANTE_NO_ENCONTRADA = "Vacante no encontrada";

    private final VacanteRepository vacanteRepository;
    private final EmpresaRepository empresaRepository;
    private final ProgramaRepository programaRepository;
    private final EstadoVacanteResolver estadoVacanteResolver;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public VacanteResponse crearVacante(VacanteRequest request) {
        Empresa empresa = empresaRepository.findById(request.getEmpresaId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));

        Programa programa = null;
        if (request.getProgramaId() != null) {
            programa = programaRepository.findById(request.getProgramaId())
                    .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));
        }

        Vacante vacante = Vacante.builder()
                .empresa(empresa)
                .programa(programa)
                .titulo(request.getTitulo())
                .descripcion(request.getDescripcion())
                .perfilRequerido(request.getPerfilRequerido())
                .requisitos(request.getRequisitos())
                .cuposTotales(request.getCuposTotales())
                .cuposDisponibles(request.getCuposTotales())
                .modalidad(request.getModalidad())
                .salario(request.getSalario())
                .tipoContrato(request.getTipoContrato())
                .horario(request.getHorario())
                .habilidades(request.getHabilidades())
                .semestreMinimo(request.getSemestreMinimo())
                .build();

        vacante = vacanteRepository.save(vacante);

        eventPublisher.publishEvent(new VacanteCreadaEvent(vacante.getId(), empresa.getId(), vacante.getTitulo()));

        return mapToVacanteResponse(vacante);
    }

    @Override
    @Transactional
    public VacanteResponse aprobarVacante(Long vacanteId) {
        Vacante vacante = vacanteRepository.findById(vacanteId)
                .orElseThrow(() -> new IllegalArgumentException(VACANTE_NO_ENCONTRADA));

        EstadoVacante estado = estadoVacanteResolver.getEstado(vacante.getEstado());
        estado.aprobar(vacante);

        vacante = vacanteRepository.save(vacante);

        eventPublisher.publishEvent(new VacanteAprobadaEvent(vacante.getId(), vacante.getEmpresa().getId()));

        return mapToVacanteResponse(vacante);
    }

    @Override
    @Transactional
    public VacanteResponse rechazarVacante(Long vacanteId, String motivo) {
        Vacante vacante = vacanteRepository.findById(vacanteId)
                .orElseThrow(() -> new IllegalArgumentException(VACANTE_NO_ENCONTRADA));

        EstadoVacante estado = estadoVacanteResolver.getEstado(vacante.getEstado());
        estado.rechazar(vacante, motivo);

        vacante = vacanteRepository.save(vacante);
        return mapToVacanteResponse(vacante);
    }

    @Override
    @Transactional
    public VacanteResponse cerrarVacante(Long vacanteId) {
        Vacante vacante = vacanteRepository.findById(vacanteId)
                .orElseThrow(() -> new IllegalArgumentException(VACANTE_NO_ENCONTRADA));

        EstadoVacante estado = estadoVacanteResolver.getEstado(vacante.getEstado());
        estado.cerrar(vacante);

        vacante = vacanteRepository.save(vacante);
        return mapToVacanteResponse(vacante);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VacanteResponse> listarVacantesPorEmpresa(Long empresaId) {
        return vacanteRepository.findByEmpresaId(empresaId).stream()
                .map(this::mapToVacanteResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VacanteResponse> listarVacantesPendientes() {
        return vacanteRepository.findByEstado(EstadoVacanteTipo.PENDIENTE).stream()
                .map(this::mapToVacanteResponse)
                .toList();
    }

    private VacanteResponse mapToVacanteResponse(Vacante vacante) {
        return VacanteResponse.builder()
                .id(vacante.getId())
                .empresaId(vacante.getEmpresa().getId())
                .nombreEmpresa(vacante.getEmpresa().getRazonSocial())
                .programaId(vacante.getPrograma() != null ? vacante.getPrograma().getId() : null)
                .nombrePrograma(vacante.getPrograma() != null ? vacante.getPrograma().getNombre() : null)
                .titulo(vacante.getTitulo())
                .descripcion(vacante.getDescripcion())
                .perfilRequerido(vacante.getPerfilRequerido())
                .requisitos(vacante.getRequisitos())
                .cuposTotales(vacante.getCuposTotales())
                .cuposDisponibles(vacante.getCuposDisponibles())
                .estado(vacante.getEstado())
                .motivoRechazo(vacante.getMotivoRechazo())
                .fechaCreacion(vacante.getFechaCreacion())
                .modalidad(vacante.getModalidad())
                .salario(vacante.getSalario())
                .tipoContrato(vacante.getTipoContrato())
                .horario(vacante.getHorario())
                .habilidades(vacante.getHabilidades())
                .semestreMinimo(vacante.getSemestreMinimo())
                .build();
    }
}
