package com.smc.saude.service;

import com.smc.saude.domain.Estados;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link Estados}.
 */
public interface EstadosService {
    /**
     * Save a estados.
     *
     * @param estados the entity to save.
     * @return the persisted entity.
     */
    Mono<Estados> save(Estados estados);

    /**
     * Partially updates a estados.
     *
     * @param estados the entity to update partially.
     * @return the persisted entity.
     */
    Mono<Estados> partialUpdate(Estados estados);

    /**
     * Get all the estados.
     *
     * @return the list of entities.
     */
    Flux<Estados> findAll();

    /**
     * Returns the number of estados available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" estados.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<Estados> findOne(String id);

    /**
     * Delete the "id" estados.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
