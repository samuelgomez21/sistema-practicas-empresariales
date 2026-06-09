package co.edu.sistema_practicas_empresariales.modules.cierre.service;

import co.edu.sistema_practicas_empresariales.modules.cierre.service.chain.ValidadorCierreHandler;
import co.edu.sistema_practicas_empresariales.modules.cierre.service.chain.ValidadorDocumentos;
import co.edu.sistema_practicas_empresariales.modules.cierre.service.chain.ValidadorNotaDocente;
import co.edu.sistema_practicas_empresariales.modules.practica.dto.PracticaDetalleDto;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.service.PracticaFacade;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CierrePracticaFacadeImpl implements CierrePracticaFacade {

    private final PracticaRepository practicaRepository;
    private final PracticaFacade practicaFacade;
    private final ValidadorNotaDocente validadorNotaDocente;
    private final ValidadorDocumentos validadorDocumentos;

    private ValidadorCierreHandler chain;

    @PostConstruct
    public void initChain() {
        validadorNotaDocente.setNext(validadorDocumentos);
        chain = validadorNotaDocente;
    }

    @Override
    @Transactional
    public PracticaDetalleDto cerrarPractica(Long practicaId) {
        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new IllegalArgumentException("Práctica no encontrada"));

        // 1. Ejecutar la cadena de validación
        chain.validar(practica);

        // 2. Transición de estado a COMPLETADA (esto delega al patrón State internamente o a PracticaFacade)
        // Pero actualmente Practica.java no tiene un método directo "cerrar()" en el modelo, solo registra la nota que puede cambiar a COMPLETADA.
        // Simularemos el cierre final o generaremos un reporte de cierre si el usuario lo requiere.
        // Por seguridad, aseguramos que la práctica no esté ya cerrada
        if (practica.getEstado() == co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo.COMPLETADA) {
             throw new IllegalStateException("La práctica ya se encuentra completada/cerrada.");
        }
        
        // Registrar nota final dispara la finalización, pero como es el Cierre podemos forzar estado
        practica.setEstado(co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo.COMPLETADA);
        practicaRepository.save(practica);
        
        return practicaFacade.obtenerDetalle(practicaId);
    }
}
