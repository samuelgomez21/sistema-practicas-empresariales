package co.edu.sistema_practicas_empresariales.modules.infraestructura.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Interfaz del servicio de almacenamiento de archivos.
 * Patrón Adapter: el dominio depende de esta interfaz,
 * no de Cloudinary directamente.
 */
public interface ArchivoStorageService {

    /**
     * Sube un MultipartFile a Cloudinary.
     * @param archivo       archivo a subir
     * @param carpeta       carpeta destino (ej: "practicas/arl")
     * @param nombreArchivo nombre personalizado sin extensión
     * @return URL pública del archivo
     */
    String subirArchivo(MultipartFile archivo, String carpeta, String nombreArchivo);

    /**
     * Sube bytes crudos a Cloudinary (usado para PDFs generados en memoria).
     * @param bytes         contenido del archivo
     * @param carpeta       carpeta destino (ej: "contratos")
     * @param nombreArchivo nombre con extensión (ej: "contrato_11_123.pdf")
     * @return URL pública del archivo
     */
    String subirArchivoBytes(byte[] bytes, String carpeta, String nombreArchivo);

    /**
     * Elimina un archivo de Cloudinary por su URL pública.
     */
    void eliminarArchivo(String url);
}