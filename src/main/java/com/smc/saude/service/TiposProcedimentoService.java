package com.smc.saude.service;

import com.smc.saude.domain.TiposProcedimento;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link TiposProcedimento}.
 */
public interface TiposProcedimentoService {
    /**
     * Save a tiposProcedimento.
     *
     * @param tiposProcedimento the entity to save.
     * @return the persisted entity.
     */
    Mono<TiposProcedimento> save(TiposProcedimento tiposProcedimento);

    /**
     * Partially updates a tiposProcedimento.
     *
     * @param tiposProcedimento the entity to update partially.
     * @return the persisted entity.
     */
    Mono<TiposProcedimento> partialUpdate(TiposProcedimento tiposProcedimento);

    /**
     * Get all the tiposProcedimentos.
     *
     * @return the list of entities.
     */
    Flux<TiposProcedimento> findAll();

    /**
     * Returns the number of tiposProcedimentos available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" tiposProcedimento.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<TiposProcedimento> findOne(String id);

    /**
     * Delete the "id" tiposProcedimento.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
