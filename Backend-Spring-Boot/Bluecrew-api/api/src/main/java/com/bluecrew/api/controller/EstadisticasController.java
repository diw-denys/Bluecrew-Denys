package com.bluecrew.api.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bluecrew.api.service.EventoService;
import com.bluecrew.api.service.RecoleccionResiduosService;
import com.bluecrew.api.service.UsuarioService;
import com.bluecrew.api.service.OrganizacionService;
import com.bluecrew.api.service.ContactoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "Estadísticas", description = "Operaciones relacionadas con estadísticas globales")
public class EstadisticasController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private RecoleccionResiduosService recoleccionResiudosService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/estadisticas/globales")
    @Operation(summary = "Obtiene estadísticas globales", description = "Retorna una lista con los voluntarios activos, eventos finalizados y total de basura recolectada")
    public ResponseEntity<Map<String, Number>> getEstadisticasGlobales() {
        Map<String, Number> stats = new HashMap<>();
        stats.put("Voluntarios_Activos", usuarioService.countActivos());
        stats.put("Eventos_Finalizados", eventoService.findEventosFinalizados());
        stats.put("Total_Basura", recoleccionResiudosService.findSum());

        return ResponseEntity.status(HttpStatus.OK)
                .body(stats);
    }

    @Autowired
    private OrganizacionService organizacionService;

    @Autowired
    private ContactoService contactoService;

    @GetMapping("/estadisticas/admin")
    @Operation(summary = "Estadísticas para el Admin", description = "Retorna total de usuarios, eventos, ONGs y mensajes nuevos")
    public ResponseEntity<Map<String, Number>> getEstadisticasAdmin() {
        Map<String, Number> stats = new HashMap<>();
        stats.put("Usuarios", usuarioService.count());
        stats.put("Eventos", eventoService.count());
        stats.put("ONGs", organizacionService.count());
        
        long countNuevos = contactoService.obtenerTodosLosContactos().stream()
                            .filter(c -> "NUEVO".equalsIgnoreCase(c.getEstado()))
                            .count();
        stats.put("Mensajes_Nuevos", countNuevos);

        return ResponseEntity.status(HttpStatus.OK)
                .body(stats);
    }

}
