package co.edu.sistema_practicas_empresariales.modules.infraestructura.storage;

import org.springframework.web.multipart.MultipartFile;
/**
 * Interfaz del servicio de almacenamiento de archivos.
 * Patrón Adapter: el dominio depende de esta interfaz,
 * no de Firebase directamente.
 */

public interface ArchivoStorageService {
    /**
     * Sube un archivo a Firebase Storage.
     * @param archivo  archivo a subir
     * @param carpeta  carpeta destino (ej: "practicas/arl")
     * @param nombreArchivo nombre personalizado sin extensión
     * @return URL pública del archivo
     */
    String subirArchivo(MultipartFile archivo, String carpeta, String nombreArchivo);

    /**
     * Elimina un archivo de Firebase Storage por su URL.
     */
    void eliminarArchivo(String url);
}
