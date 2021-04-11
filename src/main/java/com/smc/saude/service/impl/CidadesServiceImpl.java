package com.smc.saude.service.impl;

import com.smc.saude.domain.Cidades;
import com.smc.saude.repository.CidadesRepository;
import com.smc.saude.service.CidadesService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Cidades}.
 */
@Service
public class CidadesServiceImpl implements CidadesService {

    private final Logger log = LoggerFactory.getLogger(CidadesServiceImpl.class);

    private final CidadesRepository cidadesRepository;

    public CidadesServiceImpl(CidadesRepository cidadesRepository) {
        this.cidadesRepository = cidadesRepository;
    }

    @Override
    public Mono<Cidades> save(Cidades cidades) {
        log.debug("Request to save Cidades : {}", cidades);
        return cidadesRepository.save(cidades);
    }

    @Override
    public Mono<Cidades> partialUpdate(Cidades cidades) {
        log.debug("Request to partially update Cidades : {}", cidades);

        return cidadesRepository
            .findById(cidades.getId())
            .map(
                existingCidades -> {
                    if (cidades.getCidadeNome() != null) {
                        existingCidades.setCidadeNome(cidades.getCidadeNome());
                    }

                    return existingCidades;
                }
            )
            .flatMap(cidadesRepository::save);
    }

    @Override
    public Flux<Cidades> findAll() {
        log.debug("Request to get all Cidades");
        return cidadesRepository.findAll();
    }

    public Mono<Long> countAll() {
        return cidadesRepository.count();
    }

    @Override
    public Mono<Cidades> findOne(String id) {
        log.debug("Request to get Cidades : {}", id);
        return cidadesRepository.findById(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete Cidades : {}", id);
        return cidadesRepository.deleteById(id);
    }
}
