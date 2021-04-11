package com.smc.saude.service;

import com.smc.saude.domain.UsuariosSaude;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link UsuariosSaude}.
 */
public interface UsuariosSaudeService {
    /**
     * Save a usuariosSaude.
     *
     * @param usuariosSaude the entity to save.
     * @return the persisted entity.
     */
    Mono<UsuariosSaude> save(UsuariosSaude usuariosSaude);

    /**
     * Partially updates a usuariosSaude.
     *
     * @param usuariosSaude the entity to update partially.
     * @return the persisted entity.
     */
    Mono<UsuariosSaude> partialUpdate(UsuariosSaude usuariosSaude);

    /**
     * Get all the usuariosSaudes.
     *
     * @return the list of entities.
     */
    Flux<UsuariosSaude> findAll();

    /**
     * Returns the number of usuariosSaudes available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" usuariosSaude.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<UsuariosSaude> findOne(String id);

    /**
     * Delete the "id" usuariosSaude.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(String id);
}
