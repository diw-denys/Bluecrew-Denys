package com.bluecrew.api.repository;

import com.bluecrew.api.model.Calificacion;
import com.bluecrew.api.model.CalificacionId;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CalificacionRepository extends JpaRepository<Calificacion, CalificacionId> {

    @Query(value = "SELECT * FROM calificaciones", nativeQuery = true)
    List<Calificacion> findSqlAll();

    @Query(value = "SELECT * FROM calificaciones WHERE id_usuario = :#{#id.usuarioId} AND id_evento = :#{#id.eventoId}", nativeQuery = true)
    Calificacion findSqlById(@Param("id") CalificacionId calId);

    @Query(value = "SELECT COUNT(*) FROM calificaciones", nativeQuery = true)
    Long countSql();

    @Query(value = "SELECT * FROM calificaciones WHERE id_evento = :eventoId", nativeQuery = true)
    List<Calificacion> findSqlByEventoId(@Param("eventoId") Long eventoId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM calificaciones WHERE id_evento = :id", nativeQuery = true)
    void deleteSqlByEventoId(@Param("id") Integer id);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM calificaciones WHERE id_usuario = :id", nativeQuery = true)
    void deleteSqlByUsuarioId(@Param("id") Integer id);
}