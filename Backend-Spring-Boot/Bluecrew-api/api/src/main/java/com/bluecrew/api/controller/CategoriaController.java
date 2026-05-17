package com.bluecrew.api.controller;

import com.bluecrew.api.model.Categoria;
import com.bluecrew.api.service.CategoriaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "Categorías", description = "Operaciones relacionadas con las categorías")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // ***************************************************************************
    // CONSULTAS
    // ***************************************************************************

    // http://localhost:8080/api/categorias
    @GetMapping("/categorias")
    @Operation(summary = "Obtener todas las categorías", description = "Retorna una lista completa de todas las categorías registradas")
    public ResponseEntity<List<Categoria>> showAll() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(categoriaService.findAll());
    }

    // http://localhost:8080/api/categorias/2
    @GetMapping("/categorias/{id}")
    @Operation(summary = "Obtener una categoría por su id", description = "Retorna una categría por su id")
    public ResponseEntity<Categoria> showById(@PathVariable int id) {
        Categoria cat = categoriaService.findById(id);

        if (cat == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(null); // 404 Not Found
        } else {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(cat);
        }
    }

    // http://localhost:8080/api/categorias/count
    @GetMapping("/categorias/count")
    @Operation(summary = "Obteniene la cantidad de categorías", description = "Retorna la cantidad de categorás")
    public ResponseEntity<Map<String, Object>> count() {

        ResponseEntity<Map<String, Object>> response = null;

        Map<String, Object> map = new HashMap<>();
        map.put("count", categoriaService.count());

        response = ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(map);

        return response;
    }

    // ***************************************************************************
    // ACTUALIZACIONES
    // ***************************************************************************

    // ****************************************************************************
    // INSERT (POST)
    // http://localhost:8080/api/categorias
    @PostMapping("/categorias")
    @Operation(summary = "Crea una categoría", description = "Inserta una categoría nueva en la base de datos")
    public ResponseEntity<Map<String, Object>> create(
            @Valid @RequestBody Categoria cat) {

        ResponseEntity<Map<String, Object>> response;

        if (cat == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "El cuerpo de la solicitud no puede estar vacío");

            response = ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(map);
        } else {
            // Validaciones manuales al estilo de la profesora
            if (cat.getNombreCategoria() == null || cat.getNombreCategoria().trim().isEmpty() ||
                    cat.getDescripcion() == null || cat.getDescripcion().trim().isEmpty()) {

                Map<String, Object> map = new HashMap<>();
                String error = "";
                if (cat.getNombreCategoria() == null || cat.getNombreCategoria().trim().isEmpty()) {
                    if (!error.equals(""))
                        error += " - ";
                    error += "El campo 'nombreCategoria' es obligatorio";
                }
                if (cat.getDescripcion() == null || cat.getDescripcion().trim().isEmpty()) {
                    if (!error.equals(""))
                        error += " - ";
                    error += "El campo 'descripcion' es obligatorio";
                }
                map.put("error", error);

                response = ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(map);
            } else {
                System.out.println(cat);
                Categoria objPost = categoriaService.save(cat);

                Map<String, Object> map = new HashMap<>();
                map.put("mensaje", "Categoría creada con éxito");
                map.put("insertRealizado", objPost);

                response = ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(map);
            }
        }

        return response;
    }

    // ****************************************************************************
    // UPDATE (PUT)
    // http://localhost:8080/api/categorias/1
    @PutMapping("/categorias/{id}")
    @Operation(summary = "Actualiza los datos de una categoría", description = "Recibe los datos de una categoría y actualiza sus campos")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable int id,
            @Valid @RequestBody Categoria cat) {

        ResponseEntity<Map<String, Object>> response;

        if (cat == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "El cuerpo de la solicitud no puede estar vacío");

            response = ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);
        } else {
            Categoria existingObj = categoriaService.findById(id);

            if (existingObj == null) {
                Map<String, Object> map = new HashMap<>();
                map.put("error", "Categoría no encontrada");
                map.put("id", id);

                response = ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
            } else {

                // Actualizar campos si están presentes, tal como hace la profesora
                if (cat.getNombreCategoria() != null) {
                    existingObj.setNombreCategoria(cat.getNombreCategoria());
                }
                if (cat.getDescripcion() != null) {
                    existingObj.setDescripcion(cat.getDescripcion());
                }
                if (cat.getAprobado() != null) {
                    existingObj.setAprobado(cat.getAprobado());
                }
                if (cat.getFechaAprobacion() != null) {
                    existingObj.setFechaAprobacion(cat.getFechaAprobacion());
                }

                // El creador y la fecha de creación normalmente no se modifican

                Categoria objPut = categoriaService.save(existingObj);

                Map<String, Object> map = new HashMap<>();
                map.put("mensaje", "Categoría actualizada con éxito");
                map.put("updateRealizado", objPut);

                response = ResponseEntity.status(HttpStatus.OK).body(map);
            }
        }

        return response;
    }

    // ****************************************************************************
    // DELETE
    // http://localhost:8080/api/categorias/5
    @DeleteMapping("/categorias/{id}")
    @Operation(summary = "Elimina una categoría", description = "Recibe el id de una categoría y la elimina")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {

        ResponseEntity<Map<String, Object>> response;

        Categoria existingObj = categoriaService.findById(id);
        if (existingObj == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "Categoría no encontrada");
            map.put("id", id);

            response = ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
        } else {

            categoriaService.deleteById(id);

            Map<String, Object> map = new HashMap<>();
            map.put("mensaje", "Categoría eliminada con éxito");
            map.put("deletedRealizado", existingObj);

            response = ResponseEntity.status(HttpStatus.OK).body(map);
        }
        return response;
    }
}
