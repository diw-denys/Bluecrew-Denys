package com.bluecrew.api.controller;

import com.bluecrew.api.model.Contacto;
import com.bluecrew.api.model.EstadoContacto;
import com.bluecrew.api.model.Evento;
import com.bluecrew.api.model.Organizacion;
import com.bluecrew.api.model.Usuario;
import com.bluecrew.api.service.ContactoService;
import com.bluecrew.api.service.EventoService;
import com.bluecrew.api.service.OrganizacionService;
import com.bluecrew.api.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@Tag(name = "Admin", description = "Endpoints de administración protegidos para el rol ADMIN")
public class AdminController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private OrganizacionService organizacionService;

    @Autowired
    private ContactoService contactoService;

    @Autowired
    private EventoService eventoService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ==========================================
    // Dashboard y Estadísticas
    // ==========================================

    @GetMapping("/estadisticas")
    @Operation(summary = "Estadísticas del Dashboard", description = "Retorna usuarios, eventos, ONGs aprobadas y mensajes pendientes")
    public ResponseEntity<Map<String, Number>> getEstadisticasAdmin() {
        Map<String, Number> stats = new HashMap<>();
        stats.put("Usuarios", usuarioService.count());
        stats.put("Eventos", eventoService.count());
        
        long countOngsAprobadas = organizacionService.findAll().stream()
                .filter(o -> o.getEstadoAprobacion() != null && o.getEstadoAprobacion().name().equals("APROBADO"))
                .count();
        stats.put("ONGs_Aprobadas", countOngsAprobadas);

        long countNuevos = contactoService.obtenerTodosLosContactos().stream()
                .filter(c -> c.getEstado() == EstadoContacto.PENDIENTE)
                .count();
        stats.put("Mensajes_Pendientes", countNuevos);

        return ResponseEntity.ok(stats);
    }

    // ==========================================
    // Gestión de Usuarios
    // ==========================================

    @GetMapping("/usuarios")
    @Operation(summary = "Listado completo de usuarios")
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @PutMapping("/usuarios/{id}")
    @Operation(summary = "Sobrescribir datos de usuario")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable int id, @RequestBody Usuario usuario) {
        Usuario existingUser = usuarioService.findById(id);
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        // Mantener el ID
        usuario.setId(id);
        
        // Si el password se envía nuevo, encriptarlo, sino mantener el anterior
        if (usuario.getPassword_hash() != null && !usuario.getPassword_hash().trim().isEmpty()) {
            usuario.setPassword_hash(passwordEncoder.encode(usuario.getPassword_hash()));
        } else {
            usuario.setPassword_hash(existingUser.getPassword_hash());
        }

        Usuario guardado = usuarioService.save(usuario);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/usuarios/{id}")
    @Operation(summary = "Eliminar usuario")
    public ResponseEntity<Void> deleteUsuario(@PathVariable int id) {
        Usuario existingUser = usuarioService.findById(id);
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // Gestión de ONGs
    // ==========================================

    @GetMapping("/organizaciones")
    @Operation(summary = "Listado completo de organizaciones")
    public ResponseEntity<List<Organizacion>> getAllOrganizaciones() {
        return ResponseEntity.ok(organizacionService.findAll());
    }

    @PutMapping("/organizaciones/{id}")
    @Operation(summary = "Sobrescribir datos de organización")
    public ResponseEntity<Organizacion> updateOrganizacion(@PathVariable int id, @RequestBody Organizacion organizacion) {
        Organizacion existingOrg = organizacionService.findById(id);
        if (existingOrg == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        organizacion.setIdOrganizacion(id);
        
        if (organizacion.getPasswordHash() != null && !organizacion.getPasswordHash().trim().isEmpty()) {
            organizacion.setPasswordHash(passwordEncoder.encode(organizacion.getPasswordHash()));
        } else {
            organizacion.setPasswordHash(existingOrg.getPasswordHash());
        }

        Organizacion guardada = organizacionService.save(organizacion);
        return ResponseEntity.ok(guardada);
    }

    @DeleteMapping("/organizaciones/{id}")
    @Operation(summary = "Eliminar organización")
    public ResponseEntity<Void> deleteOrganizacion(@PathVariable int id) {
        Organizacion existingOrg = organizacionService.findById(id);
        if (existingOrg == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        organizacionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // Gestión de Contacto
    // ==========================================

    @GetMapping("/contactos")
    @Operation(summary = "Listado de mensajes de contacto")
    public ResponseEntity<List<Contacto>> getAllContactos() {
        return ResponseEntity.ok(contactoService.obtenerTodosLosContactos());
    }

    @PutMapping("/contactos/{id}/estado")
    @Operation(summary = "Actualiza estado y respuesta de un contacto")
    public ResponseEntity<Contacto> updateContactoEstado(@PathVariable Long id, @RequestBody Contacto updateParams) {
        List<Contacto> todos = contactoService.obtenerTodosLosContactos();
        Contacto existente = todos.stream().filter(c -> c.getId().equals(id)).findFirst().orElse(null);

        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (updateParams.getEstado() != null) {
            existente.setEstado(updateParams.getEstado());
        }
        if (updateParams.getRespuesta() != null) {
            existente.setRespuesta(updateParams.getRespuesta());
        }

        Contacto guardado = contactoService.guardarContacto(existente);
        return ResponseEntity.ok(guardado);
    }

    // ==========================================
    // Gestión de Eventos
    // ==========================================

    @PutMapping("/eventos/{id}")
    @Operation(summary = "Edición completa de eventos")
    public ResponseEntity<Evento> updateEvento(@PathVariable int id, @RequestBody Evento evento) {
        Evento existingEvento = eventoService.findById(id);
        if (existingEvento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        evento.setIdEvento(id);
        Evento guardado = eventoService.save(evento);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/eventos/{id}")
    @Operation(summary = "Eliminar evento")
    public ResponseEntity<Void> deleteEvento(@PathVariable int id) {
        Evento existingEvento = eventoService.findById(id);
        if (existingEvento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        eventoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
