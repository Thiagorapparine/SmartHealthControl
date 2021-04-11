package com.smc.saude.service.impl;

import com.smc.saude.domain.Estados;
import com.smc.saude.repository.EstadosRepository;
import com.smc.saude.service.EstadosService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Estados}.
 */
@Service
public class EstadosServiceImpl implements EstadosService {

    private final Logger log = LoggerFactory.getLogger(EstadosServiceImpl.class);

    private final EstadosRepository estadosRepository;

    public EstadosServiceImpl(EstadosRepository estadosRepository) {
        this.estadosRepository = estadosRepository;
    }

    @Override
    public Mono<Estados> save(Estados estados) {
        log.debug("Request to save Estados : {}", estados);
        return estadosRepository.save(estados);
    }

    @Override
    public Mono<Estados> partialUpdate(Estados estados) {
        log.debug("Request to partially update Estados : {}", estados);

        return estadosRepository
            .findById(estados.getId())
            .map(
                existingEstados -> {
                    if (estados.getEstadosNome() != null) {
                        existingEstados.setEstadosNome(estados.getEstadosNome());
                    }
                    if (estados.getEstadosSigla() != null) {
                        existingEstados.setEstadosSigla(estados.getEstadosSigla());
                    }

                    return existingEstados;
                }
            )
            .flatMap(estadosRepository::save);
    }

    @Override
    public Flux<Estados> findAll() {
        log.debug("Request to get all Estados");
        return estadosRepository.findAll();
    }

    public Mono<Long> countAll() {
        return estadosRepository.count();
    }

    @Override
    public Mono<Estados> findOne(String id) {
        log.debug("Request to get Estados : {}", id);
        return estadosRepository.findById(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete Estados : {}", id);
        return estadosRepository.deleteById(id);
    }
}
