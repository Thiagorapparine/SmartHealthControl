package com.smc.saude.service;

import com.smc.saude.domain.ConsultasAgenda;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link ConsultasAgenda}.
 */
public interface ConsultasAgendaService {
    /**
     * Save a consultasAgenda.
     *
     * @param consultasAgenda the entity to save.
     * @return the persisted entity.
     */
    Mono<ConsultasAgenda> save(ConsultasAgenda consultasAgenda);

    /**
     * Partially updates a consultasAgenda.
     *
     * @param consultasAgenda the entity to update partially.
     * @return the persisted entity.
     */
    Mono<ConsultasAgenda> partialUpdate(ConsultasAgenda consultasAgenda);

    /**
     * Get all the consultasAgenda.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Flux<ConsultasAgenda> findAll(Pageable pageable);

    /**
     * Returns the number of consultasAgenda available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" consultasAgenda.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<ConsultasAgenda> findOne(String id);

    /**
     * Delete the "id" consultasAgenda.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
