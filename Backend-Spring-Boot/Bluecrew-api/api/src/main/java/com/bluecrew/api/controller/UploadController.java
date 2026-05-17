package com.bluecrew.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "Upload", description = "Subida de archivos al servidor")
public class UploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @Operation(summary = "Subir imagen", description = "Guarda una imagen en el servidor y retorna el nombre del archivo")
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("imagen") MultipartFile imagen) {

        Map<String, Object> map = new HashMap<>();

        if (imagen == null || imagen.isEmpty()) {
            map.put("error", "No se ha proporcionado ningún archivo");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = imagen.getOriginalFilename();
            String uniqueFilename = System.currentTimeMillis() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.write(filePath, imagen.getBytes());

            map.put("filename", uniqueFilename);
            map.put("mensaje", "Imagen subida con éxito");
            return ResponseEntity.status(HttpStatus.CREATED).body(map);

        } catch (IOException e) {
            map.put("error", "No se pudo guardar la imagen: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }
}
