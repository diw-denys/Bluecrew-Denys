package com.bluecrew.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bluecrew.api.model.Evento;
import com.bluecrew.api.model.InscripcionId;
import com.bluecrew.api.model.Inscripciones;
import com.bluecrew.api.model.Usuario;

public interface InscripcionesRepository extends JpaRepository<Inscripciones, InscripcionId> {

        @Query(value = "SELECT * FROM Inscripciones", nativeQuery = true)
        List<Inscripciones> findSqlAll();

        @Query(value = "SELECT u.* FROM Usuarios u " +
                        "JOIN Inscripciones i ON u.id = i.id_usuario " +
                        "WHERE i.id_evento = :id", nativeQuery = true)
        List<Usuario> findSqlUsuariosPorElEvento(@Param("id") Integer id);

        @Query(value = "SELECT e.* FROM Eventos e " +
                        "JOIN Inscripciones i ON e.ID_EVENTO = i.id_evento " +
                        "WHERE i.id_usuario = :id", nativeQuery = true)
        List<Evento> findSqlEventosPorElUsuario(@Param("id") Integer id);

        @Query(value = "SELECT COUNT(*) FROM Inscripciones WHERE id_Evento = :id", nativeQuery = true)
        Long findSqlCantidadUsuariosPorElEvento(@Param("id") Integer id);

        @Query(value = "SELECT 1 FROM Inscripciones WHERE id_Evento = :idEvento AND id_Usuario = :idUsuario", nativeQuery = true)
        Integer findSqlExisteInscripcion(@Param("idEvento") Integer idEvento, @Param("idUsuario") Integer idUsuario);

        @Query(value = "SELECT u.* FROM Usuarios u " +
                        "JOIN Inscripciones i ON u.id = i.id_usuario " +
                        "WHERE i.id_evento = :id AND i.asistio = true", nativeQuery = true)
        List<Usuario> findSqlUsuariosAsistieronEvento(@Param("id") Integer id);

        @Query(value = "SELECT CONCAT(u.nombre,' ', u.apellido), COUNT(i.id_usuario) as faltas " +
                        "FROM Inscripciones i " +
                        "JOIN Usuarios u ON i.id_usuario = u.id " +
                        "WHERE i.asistio = false " +
                        "GROUP BY u.id, u.nombre " +
                        "ORDER BY faltas DESC", nativeQuery = true)
        List<Object[]> findSqlRankingInsasistencias();

        @Query(value = "SELECT FORMATDATETIME(fecha_Inscripcion, 'dd-MM-yyyy'), COUNT(*) FROM Inscripciones GROUP BY CAST(fecha_Inscripcion AS date) "
                        + "ORDER BY FORMATDATETIME(fecha_Inscripcion, 'dd-MM-yyyy') DESC", nativeQuery = true)
        List<Object[]> countInscripcionesPorDia();

        @org.springframework.data.jpa.repository.Modifying
        @org.springframework.transaction.annotation.Transactional
        @Query(value = "DELETE FROM Inscripciones WHERE id_evento = :id", nativeQuery = true)
        void deleteSqlByEventoId(@Param("id") Integer id);

        @org.springframework.data.jpa.repository.Modifying
        @org.springframework.transaction.annotation.Transactional
        @Query(value = "DELETE FROM Inscripciones WHERE id_usuario = :id", nativeQuery = true)
        void deleteSqlByUsuarioId(@Param("id") Integer id);
}
