package co.edu.sistema_practicas_empresariales.modules.encuesta.controller;

import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.EncuestaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.EncuestaResponse;
import co.edu.sistema_practicas_empresariales.modules.encuesta.service.EncuestaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/encuestas")
@RequiredArgsConstructor
public class EncuestaController {

    private final EncuestaService encuestaService;

    @PostMapping("/borrador/practica/{practicaId}/actor/{tipoActor}")
    public ResponseEntity<EncuestaResponse> guardarBorrador(
            @PathVariable Long practicaId,
            @PathVariable String tipoActor,
            @RequestBody EncuestaRequest request,
            Principal principal) {
        
        EncuestaResponse response = encuestaService.guardarBorradorEncuesta(
                practicaId, request.getRespuestasJson(), request.getComentarios(), principal.getName(), tipoActor);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/completar/practica/{practicaId}/actor/{tipoActor}")
    public ResponseEntity<EncuestaResponse> completarEncuesta(
            @PathVariable Long practicaId,
            @PathVariable String tipoActor,
            @RequestBody EncuestaRequest request,
            Principal principal) {
        
        EncuestaResponse response = encuestaService.completarEncuesta(
                practicaId, request.getRespuestasJson(), request.getComentarios(), principal.getName(), tipoActor);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/practica/{practicaId}/actor/{tipoActor}")
    public ResponseEntity<EncuestaResponse> obtenerEncuestaByActor(
            @PathVariable Long practicaId,
            @PathVariable String tipoActor) {
        
        EncuestaResponse response = encuestaService.getEncuestaByPracticaAndActor(practicaId, tipoActor);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/practica/{practicaId}")
    public ResponseEntity<List<EncuestaResponse>> obtenerEncuestasByPractica(@PathVariable Long practicaId) {
        List<EncuestaResponse> response = encuestaService.getEncuestasByPractica(practicaId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/invitar/practica/{practicaId}/actor/{tipoActor}")
    public ResponseEntity<Void> enviarInvitacion(
            @PathVariable Long practicaId,
            @PathVariable String tipoActor) {
        
        encuestaService.enviarInvitacionEncuesta(practicaId, tipoActor);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/recordatorios")
    public ResponseEntity<Void> enviarRecordatorios() {
        encuestaService.enviarRecordatoriosPendientes();
        return ResponseEntity.ok().build();
    }
}
