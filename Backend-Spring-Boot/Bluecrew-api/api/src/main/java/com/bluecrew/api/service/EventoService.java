package com.bluecrew.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bluecrew.api.model.Evento;
import com.bluecrew.api.repository.EventoRepository;

@Service
public class EventoService {
    @Autowired
    public EventoRepository eventoRepository;

    @Autowired
    private com.bluecrew.api.repository.InscripcionesRepository inscripcionesRepository;

    @Autowired
    private com.bluecrew.api.repository.CalificacionRepository calificacionRepository;

    @Autowired
    private com.bluecrew.api.repository.RecoleccionResiduosRepository recoleccionResiduosRepository;

    // ************************
    // CONSULTAS
    // ************************
    @Transactional(readOnly = true)
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Evento findById(int id) {
        return eventoRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public Long count() {
        return eventoRepository.count();
    }

    @Transactional(readOnly = true)
    public Long findEventosFinalizados() {
        return eventoRepository.findSqlEventosFinalizados();
    }

    @Transactional(readOnly = true)
    public List<Object[]> findEventoSinFinalizar() {
        return eventoRepository.findByEventoSinFinalizar();
    }

    @Transactional(readOnly = true)
    public List<Evento> findPendientesCalificarByUsuario(int id) {
        return eventoRepository.findPendientesCalificarByUsuario(id);
    }

    @Transactional(readOnly = true)
    public List<Object[]> findEventoSinFinalizarYNoInscrito(int idUsuario) {
        return eventoRepository.findByEventoSinFinalizarYNoInscrito(idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Object[]> findEventosByInscripcionUsuario(int idUsuario) {
        return eventoRepository.findEventosByInscripcionUsuario(idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Object[]> findEventosPublicadosByUsuario(int idUsuario) {
        return eventoRepository.findEventosPublicadosByUsuario(idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Object[]> findEventosPendientesAprobacionByUsuario(int idUsuario) {
        return eventoRepository.findEventosPendientesAprobacionByUsuario(idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Object[]> findEventosPublicadosByOng(int idOng) {
        return eventoRepository.findEventosPublicadosByOng(idOng);
    }

    // ************************
    // ACTUALIZACIONES
    // ************************
    @Transactional
    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Transactional
    public Evento update(int id, Evento eventoDetails) {
        Evento evento = findById(id);
        evento.setTitulo(eventoDetails.getTitulo());
        evento.setDescripcion(eventoDetails.getDescripcion());
        evento.setFechaInicio(eventoDetails.getFechaInicio());
        evento.setFechaFin(eventoDetails.getFechaFin());
        evento.setFechaPublicacion(eventoDetails.getFechaPublicacion());
        evento.setUbicacion(eventoDetails.getUbicacion());
        evento.setEstadoEvento(eventoDetails.getEstadoEvento());
        evento.setParticipantes(eventoDetails.getParticipantes());
        evento.setFinalizado(eventoDetails.getFinalizado());
        evento.setMaterialNecesario(eventoDetails.getMaterialNecesario());
        evento.setUsuario(eventoDetails.getUsuario());
        evento.setCategoria(eventoDetails.getCategoria());
        return save(evento);
    }

    @Transactional
    public void deleteById(int id) {
        inscripcionesRepository.deleteSqlByEventoId(id);
        calificacionRepository.deleteSqlByEventoId(id);
        recoleccionResiduosRepository.deleteSqlByEventoId(id);
        eventoRepository.deleteById(id);
    }
}
