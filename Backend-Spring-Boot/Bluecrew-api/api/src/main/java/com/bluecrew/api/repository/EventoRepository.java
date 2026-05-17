package com.bluecrew.api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bluecrew.api.model.Evento;

public interface EventoRepository extends JpaRepository<Evento, Integer> {
        @Query(value = "SELECT * FROM EVENTOS", nativeQuery = true)
        List<Evento> findSqlAll();

        @Query(value = "SELECT * FROM EVENTOS WHERE id_evento = :id", nativeQuery = true)
        Evento findSqlById(@Param("id") int id);

        @Query(value = "SELECT COUNT(*) as eventos FROM EVENTOS", nativeQuery = true)
        Long countSql();

        @Query(value = "SELECT e.ID_EVENTO, e.TITULO, e.IMAGEN, e.DESCRIPCION AS EVENTO_DESC, " +
                        "e.FECHA_Inicio, c.NOMBRE_CATEGORIA, c.DESCRIPCION AS CATEGORIA_DESC, " +
                        "e.MATERIAL_NECESARIO, e.UBICACION, e.PARTICIPANTES " +
                        "FROM EVENTOS e " +
                        "JOIN CATEGORIAS c ON e.ID_CATEGORIA = c.ID_CATEGORIA " +
                        "WHERE e.FINALIZADO = false AND " +
                        "e.estado = 'APROBADO' " +
                        "ORDER BY e.FECHA_Inicio DESC", nativeQuery = true)
        List<Object[]> findByEventoSinFinalizar();

        @Query(value = "SELECT e.* FROM EVENTOS e " +
                        "JOIN INSCRIPCIONES i ON e.ID_EVENTO = i.ID_EVENTO " +
                        "LEFT JOIN CALIFICACIONES c ON e.ID_EVENTO = c.ID_EVENTO AND c.ID_USUARIO = i.ID_USUARIO " +
                        "WHERE i.ID_USUARIO = :id " +
                        "  AND i.ASISTIO = TRUE " +
                        "  AND c.ID_EVENTO IS NULL", nativeQuery = true)
        List<Evento> findPendientesCalificarByUsuario(@Param("id") int id);

        @Query(value = "SELECT e.ID_EVENTO, e.TITULO, e.IMAGEN, e.DESCRIPCION AS EVENTO_DESC, " +
                        "e.FECHA_Inicio, c.NOMBRE_CATEGORIA, c.DESCRIPCION AS CATEGORIA_DESC, " +
                        "e.MATERIAL_NECESARIO, e.UBICACION, e.PARTICIPANTES " +
                        "FROM EVENTOS e " +
                        "JOIN CATEGORIAS c ON e.ID_CATEGORIA = c.ID_CATEGORIA " +
                        "WHERE e.FINALIZADO = false AND " +
                        "e.estado = 'APROBADO' " +
                        "AND NOT EXISTS ( " +
                        "    SELECT 1 FROM INSCRIPCIONES i " +
                        "    WHERE i.ID_EVENTO = e.ID_EVENTO " +
                        "    AND i.ID_USUARIO = :idUsuario" +
                        ") " +
                        "ORDER BY e.FECHA_Inicio DESC", nativeQuery = true)
        List<Object[]> findByEventoSinFinalizarYNoInscrito(@Param("idUsuario") int idUsuario);

        @Query(value = "SELECT COUNT(*) FROM EVENTOS WHERE FINALIZADO = true", nativeQuery = true)
        Long findSqlEventosFinalizados();

        @Query(value = "SELECT e.ID_EVENTO, e.TITULO, e.IMAGEN, e.DESCRIPCION AS EVENTO_DESC, " +
                        "e.FECHA_Inicio, c.NOMBRE_CATEGORIA, c.DESCRIPCION AS CATEGORIA_DESC, " +
                        "e.MATERIAL_NECESARIO, e.UBICACION, e.PARTICIPANTES " +
                        "FROM EVENTOS e " +
                        "JOIN CATEGORIAS c ON e.ID_CATEGORIA = c.ID_CATEGORIA " +
                        "JOIN INSCRIPCIONES i ON e.ID_EVENTO = i.ID_EVENTO " +
                        "WHERE i.ID_USUARIO = :idUsuario " +
                        "AND e.FINALIZADO = false " +
                        "AND e.ESTADO = 'APROBADO'", nativeQuery = true)
        List<Object[]> findEventosByInscripcionUsuario(@Param("idUsuario") int idUsuario);

        @Query(value = "SELECT e.ID_EVENTO, e.TITULO, e.IMAGEN, e.DESCRIPCION AS EVENTO_DESC, " +
                        "e.FECHA_Inicio, c.NOMBRE_CATEGORIA, c.DESCRIPCION AS CATEGORIA_DESC, " +
                        "e.MATERIAL_NECESARIO, e.UBICACION, e.PARTICIPANTES " +
                        "FROM EVENTOS e " +
                        "JOIN CATEGORIAS c ON e.ID_CATEGORIA = c.ID_CATEGORIA " +
                        "WHERE e.id_user = :idUsuario " +
                        "AND e.FINALIZADO = false " +
                        "AND e.ESTADO = 'APROBADO'", nativeQuery = true)
        List<Object[]> findEventosPublicadosByUsuario(@Param("idUsuario") int idUsuario);

        @Query(value = "SELECT e.ID_EVENTO, e.TITULO, e.IMAGEN, e.DESCRIPCION AS EVENTO_DESC, " +
                        "e.FECHA_Inicio, c.NOMBRE_CATEGORIA, c.DESCRIPCION AS CATEGORIA_DESC, " +
                        "e.MATERIAL_NECESARIO, e.UBICACION, e.PARTICIPANTES " +
                        "FROM EVENTOS e " +
                        "JOIN CATEGORIAS c ON e.ID_CATEGORIA = c.ID_CATEGORIA " +
                        "WHERE e.id_user = :idUsuario " +
                        "AND e.FINALIZADO = false " +
                        "AND e.ESTADO = 'PENDIENTE'", nativeQuery = true)
        List<Object[]> findEventosPendientesAprobacionByUsuario(@Param("idUsuario") int idUsuario);


        @Query(value = "SELECT e.ID_EVENTO, e.TITULO, e.IMAGEN, e.DESCRIPCION AS EVENTO_DESC, " +
                        "e.FECHA_Inicio, c.NOMBRE_CATEGORIA, c.DESCRIPCION AS CATEGORIA_DESC, " +
                        "e.MATERIAL_NECESARIO, e.UBICACION, e.PARTICIPANTES " +
                        "FROM EVENTOS e " +
                        "JOIN CATEGORIAS c ON e.ID_CATEGORIA = c.ID_CATEGORIA " +
                        "WHERE e.id_organizacion = :idOng " + // Filtro por ID de la ONG
                        "AND e.FINALIZADO = false " +
                        "AND e.ESTADO = 'APROBADO'", nativeQuery = true)
        List<Object[]> findEventosPublicadosByOng(@Param("idOng") int idOng);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM calificaciones WHERE id_evento IN (SELECT id_evento FROM eventos WHERE id_user = :id)", nativeQuery = true)
    void deleteCalificacionesByEventCreatorId(@Param("id") Integer id);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM inscripciones WHERE id_evento IN (SELECT id_evento FROM eventos WHERE id_user = :id)", nativeQuery = true)
    void deleteInscripcionesByEventCreatorId(@Param("id") Integer id);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM recoleccion_residuos WHERE id_evento IN (SELECT id_evento FROM eventos WHERE id_user = :id)", nativeQuery = true)
    void deleteRecoleccionesByEventCreatorId(@Param("id") Integer id);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM eventos WHERE id_user = :id", nativeQuery = true)
    void deleteEventsByCreatorId(@Param("id") Integer id);
}
