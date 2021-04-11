package com.smc.saude.web.rest;

import com.smc.saude.domain.EntidadeSaude;
import com.smc.saude.repository.EntidadeSaudeRepository;
import com.smc.saude.service.EntidadeSaudeService;
import com.smc.saude.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.smc.saude.domain.EntidadeSaude}.
 */
@RestController
@RequestMapping("/api")
public class EntidadeSaudeResource {

    private final Logger log = LoggerFactory.getLogger(EntidadeSaudeResource.class);

    private static final String ENTITY_NAME = "entidadeSaude";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EntidadeSaudeService entidadeSaudeService;

    private final EntidadeSaudeRepository entidadeSaudeRepository;

    public EntidadeSaudeResource(EntidadeSaudeService entidadeSaudeService, EntidadeSaudeRepository entidadeSaudeRepository) {
        this.entidadeSaudeService = entidadeSaudeService;
        this.entidadeSaudeRepository = entidadeSaudeRepository;
    }

    /**
     * {@code POST  /entidade-saudes} : Create a new entidadeSaude.
     *
     * @param entidadeSaude the entidadeSaude to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new entidadeSaude, or with status {@code 400 (Bad Request)} if the entidadeSaude has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/entidade-saudes")
    public Mono<ResponseEntity<EntidadeSaude>> createEntidadeSaude(@Valid @RequestBody EntidadeSaude entidadeSaude)
        throws URISyntaxException {
        log.debug("REST request to save EntidadeSaude : {}", entidadeSaude);
        if (entidadeSaude.getId() != null) {
            throw new BadRequestAlertException("A new entidadeSaude cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return entidadeSaudeService
            .save(entidadeSaude)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/entidade-saudes/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /entidade-saudes/:id} : Updates an existing entidadeSaude.
     *
     * @param id the id of the entidadeSaude to save.
     * @param entidadeSaude the entidadeSaude to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entidadeSaude,
     * or with status {@code 400 (Bad Request)} if the entidadeSaude is not valid,
     * or with status {@code 500 (Internal Server Error)} if the entidadeSaude couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/entidade-saudes/{id}")
    public Mono<ResponseEntity<EntidadeSaude>> updateEntidadeSaude(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody EntidadeSaude entidadeSaude
    ) throws URISyntaxException {
        log.debug("REST request to update EntidadeSaude : {}, {}", id, entidadeSaude);
        if (entidadeSaude.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entidadeSaude.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return entidadeSaudeRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return entidadeSaudeService
                        .save(entidadeSaude)
                        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                        .map(
                            result ->
                                ResponseEntity
                                    .ok()
                                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId()))
                                    .body(result)
                        );
                }
            );
    }

    /**
     * {@code PATCH  /entidade-saudes/:id} : Partial updates given fields of an existing entidadeSaude, field will ignore if it is null
     *
     * @param id the id of the entidadeSaude to save.
     * @param entidadeSaude the entidadeSaude to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entidadeSaude,
     * or with status {@code 400 (Bad Request)} if the entidadeSaude is not valid,
     * or with status {@code 404 (Not Found)} if the entidadeSaude is not found,
     * or with status {@code 500 (Internal Server Error)} if the entidadeSaude couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/entidade-saudes/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<EntidadeSaude>> partialUpdateEntidadeSaude(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody EntidadeSaude entidadeSaude
    ) throws URISyntaxException {
        log.debug("REST request to partial update EntidadeSaude partially : {}, {}", id, entidadeSaude);
        if (entidadeSaude.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entidadeSaude.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return entidadeSaudeRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<EntidadeSaude> result = entidadeSaudeService.partialUpdate(entidadeSaude);

                    return result
                        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                        .map(
                            res ->
                                ResponseEntity
                                    .ok()
                                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId()))
                                    .body(res)
                        );
                }
            );
    }

    /**
     * {@code GET  /entidade-saudes} : get all the entidadeSaudes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of entidadeSaudes in body.
     */
    @GetMapping("/entidade-saudes")
    public Mono<List<EntidadeSaude>> getAllEntidadeSaudes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all EntidadeSaudes");
        return entidadeSaudeService.findAll().collectList();
    }

    /**
     * {@code GET  /entidade-saudes} : get all the entidadeSaudes as a stream.
     * @return the {@link Flux} of entidadeSaudes.
     */
    @GetMapping(value = "/entidade-saudes", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<EntidadeSaude> getAllEntidadeSaudesAsStream() {
        log.debug("REST request to get all EntidadeSaudes as a stream");
        return entidadeSaudeService.findAll();
    }

    /**
     * {@code GET  /entidade-saudes/:id} : get the "id" entidadeSaude.
     *
     * @param id the id of the entidadeSaude to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the entidadeSaude, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/entidade-saudes/{id}")
    public Mono<ResponseEntity<EntidadeSaude>> getEntidadeSaude(@PathVariable String id) {
        log.debug("REST request to get EntidadeSaude : {}", id);
        Mono<EntidadeSaude> entidadeSaude = entidadeSaudeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(entidadeSaude);
    }

    /**
     * {@code DELETE  /entidade-saudes/:id} : delete the "id" entidadeSaude.
     *
     * @param id the id of the entidadeSaude to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/entidade-saudes/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteEntidadeSaude(@PathVariable String id) {
        log.debug("REST request to delete EntidadeSaude : {}", id);
        return entidadeSaudeService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
