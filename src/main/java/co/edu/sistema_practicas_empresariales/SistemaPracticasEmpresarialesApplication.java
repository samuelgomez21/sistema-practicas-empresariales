package co.edu.sistema_practicas_empresariales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy(exposeProxy = true)
public class SistemaPracticasEmpresarialesApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaPracticasEmpresarialesApplication.class, args);
    }

}
