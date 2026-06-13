package co.edu.sistema_practicas_empresariales.modules.bitacora.aspect;

import co.edu.sistema_practicas_empresariales.modules.bitacora.annotation.Auditable;
import co.edu.sistema_practicas_empresariales.modules.bitacora.model.Bitacora;
import co.edu.sistema_practicas_empresariales.modules.bitacora.repository.BitacoraRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class BitacoraAspect {

    private final BitacoraRepository bitacoraRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Around("@annotation(auditable)")
    public Object auditarAccion(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Throwable ex) {
            registrar(joinPoint, auditable, null, ex);
            throw ex;
        }

        registrar(joinPoint, auditable, result, null);

        return result;
    }

    private void registrar(ProceedingJoinPoint joinPoint, Auditable auditable, Object result, Throwable ex) {
        try {
            String usuario = obtenerUsuarioActual();
            String ip = obtenerIp();

            Map<String, Object> detallesMap = new HashMap<>();

            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String[] parameterNames = signature.getParameterNames();
            Object[] args = joinPoint.getArgs();

            Map<String, Object> argsMap = new HashMap<>();
            if (parameterNames != null) {
                for (int i = 0; i < parameterNames.length; i++) {
                    Object arg = args[i];

                    // Evitamos serializar objetos inyectados gigantes o no serializables
                    if (arg instanceof HttpServletRequest) {
                        continue;
                    }
                    if (arg instanceof MultipartFile mf) {
                        argsMap.put(parameterNames[i], Map.of(
                                "filename", mf.getOriginalFilename(),
                                "size", mf.getSize(),
                                "contentType", mf.getContentType() != null ? mf.getContentType() : ""
                        ));
                        continue;
                    }

                    argsMap.put(parameterNames[i], arg);
                }
            }

            detallesMap.put("parametros", argsMap);

            if (ex != null) {
                detallesMap.put("error", ex.getMessage());
            } else if (result != null) {
                detallesMap.put("resultado", "Éxito");
            }

            String detallesJson = objectMapper.writeValueAsString(detallesMap);
            if (detallesJson.length() > 60000) {
                detallesJson = detallesJson.substring(0, 60000) + "...";
            }

            Bitacora bitacora = Bitacora.builder()
                    .usuarioEmail(usuario)
                    .accion(auditable.accion())
                    .modulo(auditable.modulo())
                    .detalles(detallesJson)
                    .ipAddress(ip)
                    .build();

            bitacoraRepository.save(bitacora);

        } catch (Exception e) {
            log.error("Error al registrar en bitácora", e);
        }
    }

    private String obtenerUsuarioActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            return auth.getName();
        }
        return "SISTEMA/ANÓNIMO";
    }

    private String obtenerIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String ip = request.getHeader("X-Forwarded-For");
                if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
                    ip = request.getRemoteAddr();
                }
                return ip;
            }
        } catch (Exception e) {
            // Ignorar
        }
        return "DESCONOCIDA";
    }
}