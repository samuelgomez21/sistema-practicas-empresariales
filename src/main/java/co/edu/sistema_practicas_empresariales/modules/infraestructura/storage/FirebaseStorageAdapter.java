package co.edu.sistema_practicas_empresariales.modules.infraestructura.storage;


import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.firebase.cloud.StorageClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

/**
 * Patrón Adapter — implementación de ArchivoStorageService usando Firebase Storage.
 * Si se cambia el proveedor de almacenamiento, solo se reemplaza este adapter.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseStorageAdapter implements ArchivoStorageService {

    @Value("${app.firebase.storage-bucket}")
    private String storageBucket;

    @Override
    public String subirArchivo(MultipartFile archivo, String carpeta, String nombreArchivo) {
        try {
            String extension    = obtenerExtension(archivo.getOriginalFilename());
            String nombreFinal  = nombreArchivo + "_" + UUID.randomUUID() + "." + extension;
            String rutaCompleta = carpeta + "/" + nombreFinal;

            Storage storage = StorageClient.getInstance().bucket(storageBucket).getStorage();

            BlobId blobId = BlobId.of(storageBucket, rutaCompleta);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(archivo.getContentType())
                    .build();

            storage.create(blobInfo, archivo.getBytes());

            // URL pública de Firebase Storage
            return "https://firebasestorage.googleapis.com/v0/b/"
                    + storageBucket + "/o/"
                    + URLEncoder.encode(rutaCompleta, StandardCharsets.UTF_8)
                    + "?alt=media";

        } catch (IOException e) {
            log.error("Error al subir archivo a Firebase Storage: {}", e.getMessage());
            throw new RuntimeException("No se pudo subir el archivo: " + e.getMessage());
        }
    }

    @Override
    public void eliminarArchivo(String url) {
        try {
            // Extrae la ruta del archivo desde la URL de Firebase
            String ruta = url.split("/o/")[1].split("\\?")[0];
            ruta = java.net.URLDecoder.decode(ruta, StandardCharsets.UTF_8);

            Storage storage = StorageClient.getInstance().bucket(storageBucket).getStorage();
            storage.delete(BlobId.of(storageBucket, ruta));
        } catch (Exception e) {
            log.warn("No se pudo eliminar el archivo de Firebase: {}", e.getMessage());
        }
    }

    private String obtenerExtension(String nombreArchivo) {
        if (nombreArchivo == null || !nombreArchivo.contains(".")) return "pdf";
        return nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);
    }
}