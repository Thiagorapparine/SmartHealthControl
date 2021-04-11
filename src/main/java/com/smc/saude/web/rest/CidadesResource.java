package com.smc.saude.web.rest;

import com.smc.saude.domain.Cidades;
import com.smc.saude.repository.CidadesRepository;
import com.smc.saude.service.CidadesService;
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
 * REST controller for managing {@link com.smc.saude.domain.Cidades}.
 */
@RestController
@RequestMapping("/api")
public class CidadesResource {

    private final Logger log = LoggerFactory.getLogger(CidadesResource.class);

    private static final String ENTITY_NAME = "cidades";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CidadesService cidadesService;

    private final CidadesRepository cidadesRepository;

    public CidadesResource(CidadesService cidadesService, CidadesRepository cidadesRepository) {
        this.cidadesService = cidadesService;
        this.cidadesRepository = cidadesRepository;
    }

    /**
     * {@code POST  /cidades} : Create a new cidades.
     *
     * @param cidades the cidades to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cidades, or with status {@code 400 (Bad Request)} if the cidades has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cidades")
    public Mono<ResponseEntity<Cidades>> createCidades(@Valid @RequestBody Cidades cidades) throws URISyntaxException {
        log.debug("REST request to save Cidades : {}", cidades);
        if (cidades.getId() != null) {
            throw new BadRequestAlertException("A new cidades cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return cidadesService
            .save(cidades)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/cidades/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /cidades/:id} : Updates an existing cidades.
     *
     * @param id the id of the cidades to save.
     * @param cidades the cidades to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cidades,
     * or with status {@code 400 (Bad Request)} if the cidades is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cidades couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cidades/{id}")
    public Mono<ResponseEntity<Cidades>> updateCidades(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Cidades cidades
    ) throws URISyntaxException {
        log.debug("REST request to update Cidades : {}, {}", id, cidades);
        if (cidades.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cidades.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return cidadesRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return cidadesService
                        .save(cidades)
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
     * {@code PATCH  /cidades/:id} : Partial updates given fields of an existing cidades, field will ignore if it is null
     *
     * @param id the id of the cidades to save.
     * @param cidades the cidades to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cidades,
     * or with status {@code 400 (Bad Request)} if the cidades is not valid,
     * or with status {@code 404 (Not Found)} if the cidades is not found,
     * or with status {@code 500 (Internal Server Error)} if the cidades couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cidades/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<Cidades>> partialUpdateCidades(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Cidades cidades
    ) throws URISyntaxException {
        log.debug("REST request to partial update Cidades partially : {}, {}", id, cidades);
        if (cidades.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cidades.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return cidadesRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<Cidades> result = cidadesService.partialUpdate(cidades);

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
     * {@code GET  /cidades} : get all the cidades.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cidades in body.
     */
    @GetMapping("/cidades")
    public Mono<List<Cidades>> getAllCidades() {
        log.debug("REST request to get all Cidades");
        return cidadesService.findAll().collectList();
    }

    /**
     * {@code GET  /cidades} : get all the cidades as a stream.
     * @return the {@link Flux} of cidades.
     */
    @GetMapping(value = "/cidades", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Cidades> getAllCidadesAsStream() {
        log.debug("REST request to get all Cidades as a stream");
        return cidadesService.findAll();
    }

    /**
     * {@code GET  /cidades/:id} : get the "id" cidades.
     *
     * @param id the id of the cidades to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cidades, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cidades/{id}")
    public Mono<ResponseEntity<Cidades>> getCidades(@PathVariable String id) {
        log.debug("REST request to get Cidades : {}", id);
        Mono<Cidades> cidades = cidadesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(cidades);
    }

    /**
     * {@code DELETE  /cidades/:id} : delete the "id" cidades.
     *
     * @param id the id of the cidades to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cidades/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteCidades(@PathVariable String id) {
        log.debug("REST request to delete Cidades : {}", id);
        return cidadesService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
