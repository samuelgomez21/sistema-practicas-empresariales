package co.edu.sistema_practicas_empresariales.modules.infraestructura.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * Servicio de lógica de negocio para la gestión de ArchivoStorage.
 * Implementa las operaciones principales, reglas de negocio y transacciones directamente relacionadas con la base de datos.
 * 
 * <p>Esta clase ha sido documentada para proveer una comprensión clara
 * de su responsabilidad dentro de la arquitectura del sistema de prácticas empresariales.</p>
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ArchivoStorageServiceImpl implements ArchivoStorageService {

    private final Cloudinary cloudinary;

    // ── MultipartFile ──────────────────────────────────────────────────────────

    @Override
    public String subirArchivo(MultipartFile archivo, String carpeta, String nombreArchivo) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    archivo.getBytes(),
                    ObjectUtils.asMap(
                            "folder",         carpeta,
                            "public_id",      nombreArchivo,
                            "resource_type",  "auto",
                            "use_filename",   true,
                            "unique_filename", false
                    )
            );
            return result.get("secure_url").toString();
        } catch (Exception e) {
            throw new IllegalStateException("Error al subir archivo a Cloudinary: " + e.getMessage(), e);
        }
    }

    // ── Bytes crudos (PDF generado en memoria) ─────────────────────────────────

    @Override
    public String subirArchivoBytes(byte[] bytes, String carpeta, String nombreArchivo) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    bytes,
                    ObjectUtils.asMap(
                            "folder",         carpeta,
                            "public_id",      nombreArchivo.replace(".pdf", ""),
                            "resource_type",  "raw",   // PDF va como raw en Cloudinary
                            "use_filename",   true,
                            "unique_filename", false
                    )
            );
            return result.get("secure_url").toString();
        } catch (Exception e) {
            throw new IllegalStateException("Error al subir PDF a Cloudinary: " + e.getMessage(), e);
        }
    }

    // ── Eliminar ───────────────────────────────────────────────────────────────

    @Override
    public void eliminarArchivo(String url) {
        try {
            // Extraer public_id de la URL de Cloudinary
            // Ej: https://res.cloudinary.com/cloud/raw/upload/v123/contratos/contrato_11.pdf
            String publicId = extraerPublicId(url);
            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", "raw")
            );
            log.info("Archivo eliminado de Cloudinary: {}", publicId);
        } catch (Exception e) {
            log.warn("No se pudo eliminar archivo de Cloudinary: {}", url, e);
        }
    }

    private String extraerPublicId(String url) {
        // Quitar query params si los hay
        String clean = url.contains("?") ? url.substring(0, url.indexOf("?")) : url;
        // Extraer desde /upload/ en adelante, sin extensión
        int uploadIdx = clean.indexOf("/upload/");
        if (uploadIdx == -1) return clean;
        String afterUpload = clean.substring(uploadIdx + 8); // quitar "/upload/"
        // Quitar versión si hay (v123456/)
        if (afterUpload.matches("v\\d+/.*")) {
            afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);
        }
        // Quitar extensión
        int dotIdx = afterUpload.lastIndexOf(".");
        return dotIdx != -1 ? afterUpload.substring(0, dotIdx) : afterUpload;
    }
}