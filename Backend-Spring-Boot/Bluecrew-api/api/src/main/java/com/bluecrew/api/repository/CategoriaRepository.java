package com.bluecrew.api.repository;

import com.bluecrew.api.model.Categoria;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    @Query(value = "SELECT * FROM categorias", nativeQuery = true)
    List<Categoria> findSqlAll();

    @Query(value = "SELECT * FROM categorias WHERE id_categoria = :id", nativeQuery = true)
    Categoria findSqlById(@Param("id") int catId);

    @Query(value = "SELECT COUNT(*) as num_categorias FROM categorias", nativeQuery = true)
    Long countSql();

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "UPDATE categorias SET id_creador = 1 WHERE id_creador = :id", nativeQuery = true)
    void reassignCreatorByCreatorId(@Param("id") Integer id);
}
