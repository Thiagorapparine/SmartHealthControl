package com.smc.saude.service;

import com.smc.saude.domain.Profissionais;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link Profissionais}.
 */
public interface ProfissionaisService {
    /**
     * Save a profissionais.
     *
     * @param profissionais the entity to save.
     * @return the persisted entity.
     */
    Mono<Profissionais> save(Profissionais profissionais);

    /**
     * Partially updates a profissionais.
     *
     * @param profissionais the entity to update partially.
     * @return the persisted entity.
     */
    Mono<Profissionais> partialUpdate(Profissionais profissionais);

    /**
     * Get all the profissionais.
     *
     * @return the list of entities.
     */
    Flux<Profissionais> findAll();

    /**
     * Returns the number of profissionais available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" profissionais.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<Profissionais> findOne(String id);

    /**
     * Delete the "id" profissionais.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
