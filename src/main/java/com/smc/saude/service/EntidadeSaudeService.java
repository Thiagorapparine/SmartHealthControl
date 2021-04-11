package com.smc.saude.service;

import com.smc.saude.domain.EntidadeSaude;
import java.util.List;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link EntidadeSaude}.
 */
public interface EntidadeSaudeService {
    /**
     * Save a entidadeSaude.
     *
     * @param entidadeSaude the entity to save.
     * @return the persisted entity.
     */
    Mono<EntidadeSaude> save(EntidadeSaude entidadeSaude);

    /**
     * Partially updates a entidadeSaude.
     *
     * @param entidadeSaude the entity to update partially.
     * @return the persisted entity.
     */
    Mono<EntidadeSaude> partialUpdate(EntidadeSaude entidadeSaude);

    /**
     * Get all the entidadeSaudes.
     *
     * @return the list of entities.
     */
    Flux<EntidadeSaude> findAll();

    /**
     * Get all the entidadeSaudes with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Flux<EntidadeSaude> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Returns the number of entidadeSaudes available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" entidadeSaude.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<EntidadeSaude> findOne(String id);

    /**
     * Delete the "id" entidadeSaude.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
