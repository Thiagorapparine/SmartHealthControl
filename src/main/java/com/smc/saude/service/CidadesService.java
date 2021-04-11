package com.smc.saude.service;

import com.smc.saude.domain.Cidades;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link Cidades}.
 */
public interface CidadesService {
    /**
     * Save a cidades.
     *
     * @param cidades the entity to save.
     * @return the persisted entity.
     */
    Mono<Cidades> save(Cidades cidades);

    /**
     * Partially updates a cidades.
     *
     * @param cidades the entity to update partially.
     * @return the persisted entity.
     */
    Mono<Cidades> partialUpdate(Cidades cidades);

    /**
     * Get all the cidades.
     *
     * @return the list of entities.
     */
    Flux<Cidades> findAll();

    /**
     * Returns the number of cidades available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" cidades.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<Cidades> findOne(String id);

    /**
     * Delete the "id" cidades.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
