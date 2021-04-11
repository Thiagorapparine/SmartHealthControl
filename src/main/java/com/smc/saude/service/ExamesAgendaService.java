package com.smc.saude.service;

import com.smc.saude.domain.ExamesAgenda;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link ExamesAgenda}.
 */
public interface ExamesAgendaService {
    /**
     * Save a examesAgenda.
     *
     * @param examesAgenda the entity to save.
     * @return the persisted entity.
     */
    Mono<ExamesAgenda> save(ExamesAgenda examesAgenda);

    /**
     * Partially updates a examesAgenda.
     *
     * @param examesAgenda the entity to update partially.
     * @return the persisted entity.
     */
    Mono<ExamesAgenda> partialUpdate(ExamesAgenda examesAgenda);

    /**
     * Get all the examesAgenda.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Flux<ExamesAgenda> findAll(Pageable pageable);

    /**
     * Returns the number of examesAgenda available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" examesAgenda.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<ExamesAgenda> findOne(String id);

    /**
     * Delete the "id" examesAgenda.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
