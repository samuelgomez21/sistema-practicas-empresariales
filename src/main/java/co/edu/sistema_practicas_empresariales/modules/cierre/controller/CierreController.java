package co.edu.sistema_practicas_empresariales.modules.cierre.controller;

import co.edu.sistema_practicas_empresariales.modules.cierre.dto.ChecklistResponse;
import co.edu.sistema_practicas_empresariales.modules.cierre.service.ChecklistCierreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/cierre")
@RequiredArgsConstructor
public class CierreController {

    private final ChecklistCierreService checklistCierreService;

    @GetMapping("/checklist/{practicaId}")
    public ResponseEntity<ChecklistResponse> obtenerChecklist(@PathVariable Long practicaId) {
        ChecklistResponse response = checklistCierreService.obtenerChecklistCierre(practicaId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/ejecutar/{practicaId}")
    public ResponseEntity<Void> ejecutarCierre(@PathVariable Long practicaId, Principal principal) {
        checklistCierreService.ejecutarCierreFormal(practicaId, principal != null ? principal.getName() : "coordinador@unihumboldt.edu.co");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/recordatorio/{practicaId}/actor/{actorType}")
    public ResponseEntity<Void> enviarRecordatorio(@PathVariable Long practicaId, @PathVariable String actorType) {
        checklistCierreService.enviarRecordatorio(practicaId, actorType);
        return ResponseEntity.ok().build();
    }
}
