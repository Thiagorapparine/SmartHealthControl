package com.smc.saude.web.rest;

import com.smc.saude.domain.Profissionais;
import com.smc.saude.repository.ProfissionaisRepository;
import com.smc.saude.service.ProfissionaisService;
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
 * REST controller for managing {@link com.smc.saude.domain.Profissionais}.
 */
@RestController
@RequestMapping("/api")
public class ProfissionaisResource {

    private final Logger log = LoggerFactory.getLogger(ProfissionaisResource.class);

    private static final String ENTITY_NAME = "profissionais";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProfissionaisService profissionaisService;

    private final ProfissionaisRepository profissionaisRepository;

    public ProfissionaisResource(ProfissionaisService profissionaisService, ProfissionaisRepository profissionaisRepository) {
        this.profissionaisService = profissionaisService;
        this.profissionaisRepository = profissionaisRepository;
    }

    /**
     * {@code POST  /profissionais} : Create a new profissionais.
     *
     * @param profissionais the profissionais to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new profissionais, or with status {@code 400 (Bad Request)} if the profissionais has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/profissionais")
    public Mono<ResponseEntity<Profissionais>> createProfissionais(@Valid @RequestBody Profissionais profissionais)
        throws URISyntaxException {
        log.debug("REST request to save Profissionais : {}", profissionais);
        if (profissionais.getId() != null) {
            throw new BadRequestAlertException("A new profissionais cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return profissionaisService
            .save(profissionais)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/profissionais/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /profissionais/:id} : Updates an existing profissionais.
     *
     * @param id the id of the profissionais to save.
     * @param profissionais the profissionais to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profissionais,
     * or with status {@code 400 (Bad Request)} if the profissionais is not valid,
     * or with status {@code 500 (Internal Server Error)} if the profissionais couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/profissionais/{id}")
    public Mono<ResponseEntity<Profissionais>> updateProfissionais(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Profissionais profissionais
    ) throws URISyntaxException {
        log.debug("REST request to update Profissionais : {}, {}", id, profissionais);
        if (profissionais.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profissionais.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return profissionaisRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return profissionaisService
                        .save(profissionais)
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
     * {@code PATCH  /profissionais/:id} : Partial updates given fields of an existing profissionais, field will ignore if it is null
     *
     * @param id the id of the profissionais to save.
     * @param profissionais the profissionais to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profissionais,
     * or with status {@code 400 (Bad Request)} if the profissionais is not valid,
     * or with status {@code 404 (Not Found)} if the profissionais is not found,
     * or with status {@code 500 (Internal Server Error)} if the profissionais couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/profissionais/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<Profissionais>> partialUpdateProfissionais(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Profissionais profissionais
    ) throws URISyntaxException {
        log.debug("REST request to partial update Profissionais partially : {}, {}", id, profissionais);
        if (profissionais.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profissionais.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return profissionaisRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<Profissionais> result = profissionaisService.partialUpdate(profissionais);

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
     * {@code GET  /profissionais} : get all the profissionais.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of profissionais in body.
     */
    @GetMapping("/profissionais")
    public Mono<List<Profissionais>> getAllProfissionais() {
        log.debug("REST request to get all Profissionais");
        return profissionaisService.findAll().collectList();
    }

    /**
     * {@code GET  /profissionais} : get all the profissionais as a stream.
     * @return the {@link Flux} of profissionais.
     */
    @GetMapping(value = "/profissionais", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Profissionais> getAllProfissionaisAsStream() {
        log.debug("REST request to get all Profissionais as a stream");
        return profissionaisService.findAll();
    }

    /**
     * {@code GET  /profissionais/:id} : get the "id" profissionais.
     *
     * @param id the id of the profissionais to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the profissionais, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/profissionais/{id}")
    public Mono<ResponseEntity<Profissionais>> getProfissionais(@PathVariable String id) {
        log.debug("REST request to get Profissionais : {}", id);
        Mono<Profissionais> profissionais = profissionaisService.findOne(id);
        return ResponseUtil.wrapOrNotFound(profissionais);
    }

    /**
     * {@code DELETE  /profissionais/:id} : delete the "id" profissionais.
     *
     * @param id the id of the profissionais to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/profissionais/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteProfissionais(@PathVariable String id) {
        log.debug("REST request to delete Profissionais : {}", id);
        return profissionaisService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
