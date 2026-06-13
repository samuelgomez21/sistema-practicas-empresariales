package co.edu.sistema_practicas_empresariales.modules.configuracion.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.*;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.CatalogoPractica;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.ProgramaParametro;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.CatalogoPracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaParametroRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Facultad;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.FacultadRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.ScopeTipo;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.repository.EstudianteRepository;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import co.edu.sistema_practicas_empresariales.modules.bitacora.annotation.Auditable;
/**
 * Implementación de la fachada de configuración del sistema.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade.
 * Esta clase orquesta la lógica de negocio para interactuar con repositorios de
 * catálogos, programas y el proveedor del Singleton global de configuración.
 * Oculta la complejidad de la inicialización de proxies de Hibernate y las
 * búsquedas compuestas al controlador.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class ConfiguracionFacadeImpl implements ConfiguracionFacade {

    private final ProgramaRepository programaRepository;
    private final CatalogoPracticaRepository catalogoRepository;
    private final FacultadRepository facultadRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final ProgramaParametroRepository programaParametroRepository;
    private final co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository practicaRepository;
    
    // Obtenemos el singleton de configuración a través del contenedor (Patrón Singleton/DI)
    private final ConfiguracionProvider configuracionSistema;

    @Override
    @Transactional(readOnly = true)
    /**
     * Lista los catálogos de práctica activos para un programa específico.
     * @param programaId ID del programa.
     * @return Lista de catálogos activos.
     */
    public List<CatalogoPractica> listarCatalogosPorPrograma(Long programaId) {
        return catalogoRepository.findByProgramaIdAndActivoTrue(programaId);
    }

    @Override
    @Transactional
    @Auditable(accion = "CREAR", modulo = "CATALOGO_PRACTICAS")
    /**
     * Crea un nuevo catálogo de práctica con base en la información suministrada.
     * @param request Datos del catálogo.
     * @return El catálogo creado.
     * @throws IllegalArgumentException Si el programa no existe.
     */
    public CatalogoPractica crearCatalogo(CatalogoPracticaRequest request) {
        Programa programa = programaRepository.findById(request.getProgramaId())
                .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));
                
        CatalogoPractica catalogo = CatalogoPractica.builder()
                .numeroPractica(request.getNumeroPractica())
                .nombre(request.getNombre())
                .materiaNucleo(request.getMateriaNucleo())
                .materiaNucleoCodigo(request.getMateriaNucleoCodigo())
                .descripcion(request.getDescripcion())
                .programa(programa)
                .cortesPorPractica(request.getCortesPorPractica())
                .duracionSemanas(request.getDuracionSemanas())
                .documentosRequeridos(request.getDocumentosRequeridos())
                .activo(true)
                .build();
                
        catalogo = catalogoRepository.save(catalogo);
        // FORZAR LA INICIALIZACION PARA QUE JACKSON NO FALLE
        org.hibernate.Hibernate.initialize(catalogo.getPrograma().getFacultad());
        return catalogo;
    }

    @Override
    @Transactional
    @Auditable(accion = "ACTUALIZAR", modulo = "CATALOGO_PRACTICAS")
/**
 * Cambia el estado (activo/inactivo) de un catálogo de práctica.
 * @param catalogoId ID del catálogo a modificar.
 * @param activo Nuevo estado booleano.
 * @throws IllegalArgumentException Si el catálogo no existe.
 * @throws IllegalStateException Si se intenta desactivar con prácticas activas vinculadas.
 */
    public void activarDesactivarCatalogo(Long catalogoId, boolean activo) {
        CatalogoPractica catalogo = catalogoRepository.findById(catalogoId)
                .orElseThrow(() -> new IllegalArgumentException("Catálogo no encontrado"));

        if (!activo) {
            long activas = practicaRepository.countActivasByCatalogoPracticaId(catalogoId);
            if (activas > 0) {
                throw new IllegalStateException(
                        "No se puede desactivar: hay " + activas + " práctica(s) activa(s) vinculadas a este catálogo");
            }
        }

        catalogo.setActivo(activo);
        catalogoRepository.save(catalogo);
    }

    @Override
    /**
     * @return El nombre global de la aplicación (Patrón Singleton).
     */
    public String getNombreAplicacion() {
        return configuracionSistema.getNombreAplicacion();
    }

    @Override
    /**
     * @return La versión global del sistema (Patrón Singleton).
     */
    public String getVersion() {
        return configuracionSistema.getVersion();
    }

    // --- FACULTAD ---
    @Override
    @Transactional(readOnly = true)
    public List<FacultadDto> listarFacultades() {
        return facultadRepository.findAll().stream()
                .map(f -> new FacultadDto(f.getId(), f.getNombre(), f.isActivo()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @Auditable(accion = "CREAR", modulo = "FACULTADES")
    public FacultadDto crearFacultad(FacultadRequest request) {
        Facultad f = Facultad.builder()
                .nombre(request.getNombre())
                .activo(true)
                .build();
        f = facultadRepository.save(f);
        return new FacultadDto(f.getId(), f.getNombre(), f.isActivo());
    }

    @Override
    @Transactional
    @Auditable(accion = "ACTUALIZAR", modulo = "FACULTADES")
    public FacultadDto actualizarFacultad(Long id, FacultadRequest request) {
        Facultad f = facultadRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Facultad no encontrada"));
        validarEdicionFacultad(id);
        f.setNombre(request.getNombre());
        f = facultadRepository.save(f);
        return new FacultadDto(f.getId(), f.getNombre(), f.isActivo());
    }

    @Override
    @Transactional
    @Auditable(accion = "ACTUALIZAR", modulo = "FACULTADES")
    public void eliminarFacultad(Long id) {
        Facultad f = facultadRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Facultad no encontrada"));
        validarEdicionFacultad(id);
        f.setActivo(false);
        facultadRepository.save(f);
    }

    private void validarEdicionFacultad(Long facultadId) {
        if (usuarioRepository.existsByScopeTipoAndScopeValorId(ScopeTipo.FACULTAD, String.valueOf(facultadId))) {
            throw new IllegalStateException("No se puede editar o eliminar la facultad porque tiene usuarios asociados");
        }
        // Verificar si hay estudiantes en programas de esta facultad
        List<Programa> programas = programaRepository.findByFacultadIdAndActivoTrue(facultadId);
        for (Programa p : programas) {
            if (estudianteRepository.existsByProgramaId(p.getId())) {
                throw new IllegalStateException("No se puede editar o eliminar la facultad porque tiene estudiantes matriculados en sus programas");
            }
        }
    }

    // --- PROGRAMA ---
    @Override
    @Transactional(readOnly = true)
    public List<ProgramaDto> listarProgramas() {
        return programaRepository.findAll().stream()
                .map(p -> new ProgramaDto(p.getId(), p.getNombre(), p.getFacultad().getId(), p.getFacultad().getNombre(), p.isActivo()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @Auditable(accion = "CREAR", modulo = "PROGRAMAS")
    public ProgramaDto crearPrograma(ProgramaRequest request) {
        Facultad f = facultadRepository.findById(request.getFacultadId())
                .orElseThrow(() -> new IllegalArgumentException("Facultad no encontrada"));
        Programa p = Programa.builder()
                .nombre(request.getNombre())
                .facultad(f)
                .activo(true)
                .build();
        p = programaRepository.save(p);
        return new ProgramaDto(p.getId(), p.getNombre(), f.getId(), f.getNombre(), p.isActivo());
    }

    @Override
    @Transactional
    @Auditable(accion = "ACTUALIZAR", modulo = "PROGRAMAS")
    public ProgramaDto actualizarPrograma(Long id, ProgramaRequest request) {
        Programa p = programaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));
        validarEdicionPrograma(id);
        Facultad f = facultadRepository.findById(request.getFacultadId())
                .orElseThrow(() -> new IllegalArgumentException("Facultad no encontrada"));
        p.setNombre(request.getNombre());
        p.setFacultad(f);
        p = programaRepository.save(p);
        return new ProgramaDto(p.getId(), p.getNombre(), f.getId(), f.getNombre(), p.isActivo());
    }

    @Override
    @Transactional
    @Auditable(accion = "DESACTIVAR", modulo = "PROGRAMAS")
    public void eliminarPrograma(Long id) {
        Programa p = programaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));
        validarEdicionPrograma(id);
        p.setActivo(false);
        programaRepository.save(p);
    }

    private void validarEdicionPrograma(Long programaId) {
        if (usuarioRepository.existsByScopeTipoAndScopeValorId(ScopeTipo.PROGRAMA, String.valueOf(programaId))) {
            throw new IllegalStateException("No se puede editar o eliminar el programa porque tiene usuarios asociados");
        }
        if (estudianteRepository.existsByProgramaId(programaId)) {
            throw new IllegalStateException("No se puede editar o eliminar el programa porque tiene estudiantes matriculados");
        }
    }

    // PARÁMETROS POR PROGRAMA


    @Override
    @Transactional()
    public ProgramaParametroDto obtenerParametrosPrograma(Long programaId) {
        Programa programa = programaRepository.findById(programaId)
                .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));

        ProgramaParametro parametro = programaParametroRepository.findByProgramaId(programaId)
                .orElseGet(() -> crearParametroPorDefecto(programa));

        return mapParametroToDto(parametro);
    }

    @Override
    @Transactional
    @Auditable(accion = "ACTUALIZAR", modulo = "PARAMETROS_PROGRAMA")
    public ProgramaParametroDto actualizarParametrosPrograma(Long programaId, ProgramaParametroRequest request) {
        Programa programa = programaRepository.findById(programaId)
                .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));

        ProgramaParametro parametro = programaParametroRepository.findByProgramaId(programaId)
                .orElseGet(() -> crearParametroPorDefecto(programa));

        if (request.getNumeroPracticas() != null) {
            parametro.setNumPracticas(request.getNumeroPracticas());
        }
        if (request.getCorteseguimiento() != null) {
            parametro.setCortesPorPractica(request.getCorteseguimiento());
        }
        if (request.getNotaMinima() != null) {
            parametro.setNotaMinimaAprobacion(request.getNotaMinima());
        }
        if (request.getMaxAsignacionesSimultaneas() != null) {
            parametro.setMaxAsignacionesSimultaneas(request.getMaxAsignacionesSimultaneas());
        }
        if (request.getUmbralInactividadDias() != null) {
            parametro.setUmbralInactividadDias(request.getUmbralInactividadDias());
        }
        if (request.getDocumentosRequeridos() != null) {
            parametro.setDocumentosRequeridos(request.getDocumentosRequeridos());
        }

        parametro = programaParametroRepository.save(parametro);
        return mapParametroToDto(parametro);
    }

    private ProgramaParametro crearParametroPorDefecto(Programa programa) {
        ProgramaParametro nuevo = ProgramaParametro.builder()
                .programa(programa)
                .build(); // usa los @Builder.Default de la entidad
        return programaParametroRepository.save(nuevo);
    }

    private ProgramaParametroDto mapParametroToDto(ProgramaParametro p) {
        return ProgramaParametroDto.builder()
                .programaId(p.getPrograma().getId())
                .numeroPracticas(p.getNumPracticas())
                .corteseguimiento(p.getCortesPorPractica())
                .notaMinima(p.getNotaMinimaAprobacion())
                .maxAsignacionesSimultaneas(p.getMaxAsignacionesSimultaneas())
                .umbralInactividadDias(p.getUmbralInactividadDias())
                .documentosRequeridos(p.getDocumentosRequeridos())
                .build();
    }


// EDICIÓN DE CATÁLOGO DE PRÁCTICAS


    @Override
    @Transactional
    @Auditable(accion = "ACTUALIZAR", modulo = "CATALOGO_PRACTICAS")
    public CatalogoPractica actualizarCatalogo(Long id, CatalogoPracticaRequest request) {
        CatalogoPractica catalogo = catalogoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Catálogo no encontrado"));

        if (request.getProgramaId() != null
                && !request.getProgramaId().equals(catalogo.getPrograma().getId())) {
            Programa programa = programaRepository.findById(request.getProgramaId())
                    .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));
            catalogo.setPrograma(programa);
        }

        catalogo.setNumeroPractica(request.getNumeroPractica());
        catalogo.setNombre(request.getNombre());
        catalogo.setMateriaNucleo(request.getMateriaNucleo());
        catalogo.setMateriaNucleoCodigo(request.getMateriaNucleoCodigo());
        catalogo.setDescripcion(request.getDescripcion());
        catalogo.setCortesPorPractica(request.getCortesPorPractica());
        catalogo.setDuracionSemanas(request.getDuracionSemanas());
        catalogo.setDocumentosRequeridos(request.getDocumentosRequeridos());

        catalogo = catalogoRepository.save(catalogo);
        org.hibernate.Hibernate.initialize(catalogo.getPrograma().getFacultad());
        return catalogo;
    }

    @Override
    @Transactional(readOnly = true)
/**
 * Lista los catálogos de práctica activos de un programa, incluyendo
 * el conteo de prácticas activas vinculadas a cada uno.
 * @param programaId ID del programa.
 * @return Lista de catálogos con su conteo de prácticas activas.
 */
    public List<co.edu.sistema_practicas_empresariales.modules.configuracion.dto.CatalogoPracticaConConteoDto> listarCatalogosPorProgramaConConteo(Long programaId) {
        return catalogoRepository.findByProgramaId(programaId).stream()
                .map(c -> CatalogoPracticaConConteoDto.from(c, practicaRepository.countActivasByCatalogoPracticaId(c.getId())))
                .toList();
    }
}
