package com.smc.saude.service;

import com.smc.saude.domain.SetorSaude;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link SetorSaude}.
 */
public interface SetorSaudeService {
    /**
     * Save a setorSaude.
     *
     * @param setorSaude the entity to save.
     * @return the persisted entity.
     */
    Mono<SetorSaude> save(SetorSaude setorSaude);

    /**
     * Partially updates a setorSaude.
     *
     * @param setorSaude the entity to update partially.
     * @return the persisted entity.
     */
    Mono<SetorSaude> partialUpdate(SetorSaude setorSaude);

    /**
     * Get all the setorSaudes.
     *
     * @return the list of entities.
     */
    Flux<SetorSaude> findAll();

    /**
     * Returns the number of setorSaudes available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" setorSaude.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<SetorSaude> findOne(String id);

    /**
     * Delete the "id" setorSaude.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
