package co.edu.sistema_practicas_empresariales.modules.infraestructura.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.io.InputStream;

/**
 * Configuración de Firebase Admin SDK.
 */
@Slf4j
@Configuration
@org.springframework.context.annotation.Profile("!test")
public class FirebaseConfig {

    @Value("${app.firebase.config-path}")
    private String configPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        InputStream serviceAccount = getClass()
                .getClassLoader()
                .getResourceAsStream(configPath);

        if (serviceAccount == null) {
            log.warn("firebase-service-account.json no encontrado. Storage no disponible.");
            return null;
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        return FirebaseApp.initializeApp(options);
    }
}