package com.bluecrew.api.controller;

import com.bluecrew.api.model.Contacto;
import com.bluecrew.api.service.ContactoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contactos")
@CrossOrigin(origins = "*")
@Tag(name = "Contactos", description = "API para la gestión de mensajes de contacto de la web")
public class ContactoController {

    @Autowired
    private ContactoService contactoService;

    @Operation(summary = "Obtener todos los mensajes", description = "Retorna un listado con todos los mensajes de contacto recibidos. Ideal para el panel de Administración.")
    @GetMapping
    public ResponseEntity<List<Contacto>> getAllContactos() {
        List<Contacto> contactos = contactoService.obtenerTodosLosContactos();
        return new ResponseEntity<>(contactos, HttpStatus.OK);
    }

    @Operation(summary = "Crear nuevo mensaje de contacto", description = "Guarda un mensaje enviado desde el formulario de la página web.")
    @PostMapping
    public ResponseEntity<Contacto> createContacto(@RequestBody Contacto contacto) {
        Contacto nuevoContacto = contactoService.guardarContacto(contacto);
        return new ResponseEntity<>(nuevoContacto, HttpStatus.CREATED);
    }

    @Operation(summary = "Eliminar mensaje de contacto", description = "Borra un mensaje de contacto específico a través de su ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContacto(@PathVariable Long id) {
        contactoService.eliminarContacto(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Actualizar estado de mensaje de contacto", description = "Actualiza el estado (respondido, etc) y la respuesta del mensaje.")
    @PutMapping("/{id}")
    public ResponseEntity<Contacto> updateContacto(@PathVariable Long id, @RequestBody Contacto contactoActualizado) {
        List<Contacto> todos = contactoService.obtenerTodosLosContactos();
        Contacto existente = todos.stream().filter(c -> c.getId().equals(id)).findFirst().orElse(null);
        
        if (existente == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        existente.setEstado(contactoActualizado.getEstado());
        existente.setRespuesta(contactoActualizado.getRespuesta());
        
        Contacto guardado = contactoService.guardarContacto(existente);
        return new ResponseEntity<>(guardado, HttpStatus.OK);
    }
}
