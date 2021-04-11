package com.smc.saude.service.impl;

import com.smc.saude.domain.EntidadeSaude;
import com.smc.saude.repository.EntidadeSaudeRepository;
import com.smc.saude.service.EntidadeSaudeService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link EntidadeSaude}.
 */
@Service
public class EntidadeSaudeServiceImpl implements EntidadeSaudeService {

    private final Logger log = LoggerFactory.getLogger(EntidadeSaudeServiceImpl.class);

    private final EntidadeSaudeRepository entidadeSaudeRepository;

    public EntidadeSaudeServiceImpl(EntidadeSaudeRepository entidadeSaudeRepository) {
        this.entidadeSaudeRepository = entidadeSaudeRepository;
    }

    @Override
    public Mono<EntidadeSaude> save(EntidadeSaude entidadeSaude) {
        log.debug("Request to save EntidadeSaude : {}", entidadeSaude);
        return entidadeSaudeRepository.save(entidadeSaude);
    }

    @Override
    public Mono<EntidadeSaude> partialUpdate(EntidadeSaude entidadeSaude) {
        log.debug("Request to partially update EntidadeSaude : {}", entidadeSaude);

        return entidadeSaudeRepository
            .findById(entidadeSaude.getId())
            .map(
                existingEntidadeSaude -> {
                    if (entidadeSaude.getEntidadeNome() != null) {
                        existingEntidadeSaude.setEntidadeNome(entidadeSaude.getEntidadeNome());
                    }
                    if (entidadeSaude.getEntidadeSetor() != null) {
                        existingEntidadeSaude.setEntidadeSetor(entidadeSaude.getEntidadeSetor());
                    }
                    if (entidadeSaude.getEntidadeEndereco() != null) {
                        existingEntidadeSaude.setEntidadeEndereco(entidadeSaude.getEntidadeEndereco());
                    }

                    return existingEntidadeSaude;
                }
            )
            .flatMap(entidadeSaudeRepository::save);
    }

    @Override
    public Flux<EntidadeSaude> findAll() {
        log.debug("Request to get all EntidadeSaudes");
        return entidadeSaudeRepository.findAllWithEagerRelationships();
    }

    public Flux<EntidadeSaude> findAllWithEagerRelationships(Pageable pageable) {
        return entidadeSaudeRepository.findAllWithEagerRelationships(pageable);
    }

    public Mono<Long> countAll() {
        return entidadeSaudeRepository.count();
    }

    @Override
    public Mono<EntidadeSaude> findOne(String id) {
        log.debug("Request to get EntidadeSaude : {}", id);
        return entidadeSaudeRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete EntidadeSaude : {}", id);
        return entidadeSaudeRepository.deleteById(id);
    }
}
