package co.edu.sistema_practicas_empresariales.modules.infraestructura.export;

import java.util.Map;

/**
 * Interfaz para la generación de documentos basados en plantillas.
 * Aplica el patrón Adapter para aislar la librería tecnológica de PDFs o DOCs.
 */
public interface GeneradorDocumentoPlantilla {
    
    /**
     * Genera un documento a partir de una plantilla y un mapa de variables.
     * 
     * @param rutaPlantilla Ruta o identificador de la plantilla base.
     * @param variables Mapa de variables (llave-valor) a inyectar en la plantilla.
     * @return Array de bytes con el documento generado.
     */
    byte[] generarDesdePlantilla(String rutaPlantilla, Map<String, Object> variables);
}
