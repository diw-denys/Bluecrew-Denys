package com.bluecrew.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bluecrew.api.model.Usuario;
import com.bluecrew.api.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UsuarioService {
    @Autowired
    public UsuarioRepository usuarioRepository;

    @Autowired
    private com.bluecrew.api.repository.InscripcionesRepository inscripcionesRepository;

    @Autowired
    private com.bluecrew.api.repository.CalificacionRepository calificacionRepository;

    @Autowired
    private com.bluecrew.api.repository.NoticiaRepository noticiaRepository;

    @Autowired
    private com.bluecrew.api.repository.EventoRepository eventoRepository;

    @Autowired
    private com.bluecrew.api.repository.OrganizacionRepository organizacionRepository;

    @Autowired
    private com.bluecrew.api.repository.CategoriaRepository categoriaRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Transactional(readOnly = true)
    public Usuario login(String email, String passwordPlano) {
       
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
          
            if (passwordEncoder.matches(passwordPlano, usuario.getPassword_hash())) {
                return usuario; 
            }
        }
        return null;
    }
    
    // ************************
    // CONSULTAS
    // ************************  
    @Transactional(readOnly = true) 
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Transactional(readOnly = true) 
    public Usuario findById(int id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true) 
    public Long count() {
        return usuarioRepository.count();
    } 

    @Transactional(readOnly = true) 
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Transactional(readOnly = true) 
    public Long countActivos() {
        return usuarioRepository.countSqlActivos();
    }
    
    // ************************
    // ACTUALIZACIONES
    // ************************  
    @Transactional
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    @Transactional
    public Usuario update(int id, Usuario usuarioDetails) {
        Usuario usuario = findById(id);
        usuario.setRol(usuarioDetails.getRol());
        usuario.setNombre(usuarioDetails.getNombre());
        usuario.setApellido(usuarioDetails.getApellido());
        usuario.setEmail(usuarioDetails.getEmail());
        usuario.setBiografia(usuarioDetails.getBiografia());

        if (usuarioDetails.getFoto() != null) {
             usuario.setFoto(usuarioDetails.getFoto());
        }
        return usuarioRepository.save(usuario);
    }
    
    @Transactional
    public void deleteById(int id) {
        // 1. Borrar inscripciones de este usuario en cualquier evento
        inscripcionesRepository.deleteSqlByUsuarioId(id);
        
        // 2. Borrar calificaciones de este usuario en cualquier evento
        calificacionRepository.deleteSqlByUsuarioId(id);
        
        // 3. Borrar noticias escritas por este usuario
        noticiaRepository.deleteSqlByAutorId(id);
        
        // 4. Borrar calificaciones, inscripciones y recolecciones de residuos asociadas a eventos creados por este usuario
        eventoRepository.deleteCalificacionesByEventCreatorId(id);
        eventoRepository.deleteInscripcionesByEventCreatorId(id);
        eventoRepository.deleteRecoleccionesByEventCreatorId(id);
        
        // 5. Borrar eventos creados por este usuario (para cumplir la restricción CHECK CHK_Creador_Evento)
        eventoRepository.deleteEventsByCreatorId(id);
        
        // 6. Reasignar categorías creadas por este usuario al administrador Pepe (ID 1)
        categoriaRepository.reassignCreatorByCreatorId(id);
        
        // 7. Desvincular organizaciones aprobadas por este usuario
        organizacionRepository.nullifyApprovedByUserId(id);
        
        // 8. Finalmente borrar el usuario
        usuarioRepository.deleteById(id);
    }    
}
