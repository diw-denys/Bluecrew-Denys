package com.bluecrew.api.repository;

import com.bluecrew.api.model.RecoleccionResiduos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecoleccionResiduosRepository extends JpaRepository<RecoleccionResiduos, Integer> {

    @Query(value = "SELECT * FROM RECOLECCION_RESIDUOS", nativeQuery = true)
    List<RecoleccionResiduos> findSqlAll();

    @Query(value = "SELECT CANTIDAD_RECOLECTADA FROM RECOLECCION_RESIDUOS WHERE ID_EVENTO = :idEvento", nativeQuery = true)
    Double findSqlByIdEvento(@Param("idEvento") int idEvento);

    @Query(value = "SELECT SUM(CANTIDAD_RECOLECTADA) FROM RECOLECCION_RESIDUOS", nativeQuery = true)
    Long findSqlSum();

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM RECOLECCION_RESIDUOS WHERE id_evento = :id", nativeQuery = true)
    void deleteSqlByEventoId(@Param("id") Integer id);
}
