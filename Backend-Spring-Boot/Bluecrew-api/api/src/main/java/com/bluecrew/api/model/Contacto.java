package com.bluecrew.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contactos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Modelo de mensajes de Contacto", name = "Contacto")
public class Contacto {

    @Schema(description = "ID único del mensaje", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(description = "Nombre de la persona que contacta", example = "Laura")
    @Column(nullable = false)
    private String nombre;

    @Schema(description = "Apellidos de la persona que contacta", example = "García")
    @Column(nullable = false)
    private String apellidos;

    @Schema(description = "Correo electrónico para responder", example = "laura.garcia@email.com")
    @Column(nullable = false)
    private String email;

    @Schema(description = "Dirección física (Opcional)", example = "Calle Falsa 123, Alicante")
    @Column(length = 255)
    private String direccion;

    @Schema(description = "Asunto del mensaje", example = "Problema con inicio de sesión")
    @Column(length = 150)
    private String asunto;

    @Schema(description = "Cuerpo del mensaje o duda", example = "Hola, me gustaría saber cómo puedo...")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Schema(description = "Estado actual del mensaje", example = "NUEVO")
    @Column(length = 50)
    private String estado = "NUEVO";

    @Schema(description = "Respuesta enviada al usuario (Opcional)", example = "Gracias por contactar, el problema ha sido resuelto.")
    @Column(columnDefinition = "TEXT")
    private String respuesta;

    @Schema(description = "Fecha en la que se envió el mensaje de contacto")
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}