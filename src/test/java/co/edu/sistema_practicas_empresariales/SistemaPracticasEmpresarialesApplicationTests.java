package co.edu.sistema_practicas_empresariales;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.flyway.enabled=false",
    "app.jwt.secret=test-secret-key-very-long-and-secure-for-testing-purposes",
    "app.jwt.expiration-ms=86400000",
    "app.firebase.config-path=classpath:firebase-service-account.json",
    "app.firebase.storage-bucket=practicas-uah.appspot.com"
})
@ActiveProfiles("test")
class SistemaPracticasEmpresarialesApplicationTests {

    @Test
    void contextLoads() {
        // Empty method to verify that the Spring ApplicationContext loads successfully.
    }

}
