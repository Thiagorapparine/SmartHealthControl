package com.smc.saude.service;

import com.smc.saude.domain.SaudeTipo;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link SaudeTipo}.
 */
public interface SaudeTipoService {
    /**
     * Save a saudeTipo.
     *
     * @param saudeTipo the entity to save.
     * @return the persisted entity.
     */
    Mono<SaudeTipo> save(SaudeTipo saudeTipo);

    /**
     * Partially updates a saudeTipo.
     *
     * @param saudeTipo the entity to update partially.
     * @return the persisted entity.
     */
    Mono<SaudeTipo> partialUpdate(SaudeTipo saudeTipo);

    /**
     * Get all the saudeTipos.
     *
     * @return the list of entities.
     */
    Flux<SaudeTipo> findAll();

    /**
     * Returns the number of saudeTipos available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" saudeTipo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<SaudeTipo> findOne(String id);

    /**
     * Delete the "id" saudeTipo.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
