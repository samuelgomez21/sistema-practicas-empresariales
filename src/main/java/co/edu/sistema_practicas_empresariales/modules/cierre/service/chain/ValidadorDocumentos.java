package co.edu.sistema_practicas_empresariales.modules.cierre.service.chain;

import co.edu.sistema_practicas_empresariales.modules.practica.exception.BusinessException;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.model.PracticaDocumento;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaDocumentoRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaParametroRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.ProgramaParametro;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ValidadorDocumentos extends BaseValidadorCierre {

    private final PracticaDocumentoRepository practicaDocumentoRepository;
    private final ProgramaParametroRepository programaParametroRepository;

    public ValidadorDocumentos(PracticaDocumentoRepository practicaDocumentoRepository, ProgramaParametroRepository programaParametroRepository) {
        super(null);
        this.practicaDocumentoRepository = practicaDocumentoRepository;
        this.programaParametroRepository = programaParametroRepository;
    }

    @Override
    public void validar(Practica practica) {
        ProgramaParametro parametros = programaParametroRepository.findByProgramaId(practica.getEstudiante().getPrograma().getId())
                .orElseThrow(() -> new BusinessException("No se encontraron parámetros para el programa de la práctica"));
                
        List<String> categoriasObligatorias = Arrays.stream(parametros.getDocumentosRequeridos().split(","))
                .map(String::trim)
                .collect(Collectors.toList());

        List<PracticaDocumento> documentos = practicaDocumentoRepository.findByPracticaId(practica.getId());

        // Agrupar por categoría
        Map<String, List<PracticaDocumento>> docsPorCategoria = documentos.stream()
                .collect(Collectors.groupingBy(d -> d.getCategoria().toUpperCase()));

        // Verificar que existan todas las categorías obligatorias
        for (String categoria : categoriasObligatorias) {
            List<PracticaDocumento> docs = docsPorCategoria.get(categoria.toUpperCase());
            if (docs == null || docs.isEmpty()) {
                throw new BusinessException("Falta cargar el documento obligatorio de la categoría: " + categoria);
            }

            // Verificar que al menos uno esté aprobado
            boolean algunoAprobado = docs.stream().anyMatch(d -> "APROBADO".equalsIgnoreCase(d.getEstado()));
            if (!algunoAprobado) {
                throw new BusinessException("El documento de la categoría " + categoria + " aún no ha sido aprobado.");
            }
        }

        verificarSiguiente(practica);
    }
}
