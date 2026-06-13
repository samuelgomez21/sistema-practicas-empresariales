package co.edu.sistema_practicas_empresariales.modules.usuario.controller;

import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteResponse;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.EstudianteFacade;
import co.edu.sistema_practicas_empresariales.modules.postulacion.dto.PostulacionResponseDto;
import co.edu.sistema_practicas_empresariales.modules.postulacion.service.PostulacionFacade;
import co.edu.sistema_practicas_empresariales.modules.practica.dto.PracticaDetalleDto;
import co.edu.sistema_practicas_empresariales.modules.practica.service.PracticaFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/coordinacion-empresarial")
@RequiredArgsConstructor
public class CoordinacionEmpresarialController {

    private final EstudianteFacade  estudianteFacade;
    private final PostulacionFacade postulacionFacade;
    private final PracticaFacade    practicaFacade;

    /**
     * Vista de seguimiento: estudiantes aptos/en práctica con sus postulaciones
     * y checklist de paz y salvo. Compone datos de múltiples módulos.
     */
    @GetMapping("/seguimiento")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<List<Map<String, Object>>> getSeguimiento(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<EstudianteResponse> estudiantes =
                estudianteFacade.listarPorCoordinadorPractica(userDetails.getUsername());

        List<Map<String, Object>> result = estudiantes.stream().map(e -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id",            e.getId());
            item.put("nombre",        e.getNombre());
            item.put("email",         e.getEmail());
            item.put("programa",      e.getNombrePrograma());
            item.put("programaId",    e.getProgramaId());
            item.put("semestre",      e.getSemestre());
            item.put("estadoAptitud", e.getEstadoAptitud());
            item.put("estadoPractica",e.getEstadoPractica());

            // Postulaciones activas
            List<PostulacionResponseDto> posts =
                    postulacionFacade.listarPorEstudiante(e.getId());
            item.put("postulaciones", posts);

            // Categoría para el frontend
            boolean enPractica = "EN_PRACTICA".equals(e.getEstadoPractica())
                    || "ACTIVA".equals(e.getEstadoPractica());
            item.put("categoria", enPractica ? "EN_PRACTICA" : "PROCESO");

            // Checklist (solo si está en práctica)
            item.put("checklist", List.of());
            item.put("empresaNombre", null);

            return item;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * Prácticas activas de los estudiantes del coordinador.
     */
    @GetMapping("/practicas-activas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<List<Map<String, Object>>> getPracticasActivas(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<EstudianteResponse> estudiantes =
                estudianteFacade.listarPorCoordinadorPractica(userDetails.getUsername());

        List<Map<String, Object>> result = new ArrayList<>();

        for (EstudianteResponse e : estudiantes) {
            try {
                PracticaDetalleDto practica =
                        practicaFacade.obtenerPracticaActivaEstudiante(e.getId());
                if (practica != null) {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("estudiante",    e);
                    item.put("practica",      practica);
                    result.add(item);
                }
            } catch (Exception ex) {
                // estudiante sin práctica activa — omitir
            }
        }

        return ResponseEntity.ok(result);
    }
}