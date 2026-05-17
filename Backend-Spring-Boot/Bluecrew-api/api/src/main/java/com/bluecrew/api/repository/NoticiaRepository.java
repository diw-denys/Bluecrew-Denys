package com.bluecrew.api.repository;

import com.bluecrew.api.model.Noticia;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface NoticiaRepository extends JpaRepository<Noticia, Integer> {

    @Query(value = "SELECT * FROM noticias", nativeQuery = true)
    List<Noticia> findSqlAll();
    
    @Query(value = "SELECT * FROM noticias WHERE id_noticia = :id", nativeQuery = true)
    Noticia findSqlById(@Param("id") int notId);    

    @Query(value = "SELECT COUNT(*) as noticias FROM noticias", nativeQuery = true)
    Long countSql();

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM noticias WHERE id_autor = :id", nativeQuery = true)
    void deleteSqlByAutorId(@Param("id") Integer id);
}
