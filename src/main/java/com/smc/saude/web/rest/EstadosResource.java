package com.smc.saude.web.rest;

import com.smc.saude.domain.Estados;
import com.smc.saude.repository.EstadosRepository;
import com.smc.saude.service.EstadosService;
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
 * REST controller for managing {@link com.smc.saude.domain.Estados}.
 */
@RestController
@RequestMapping("/api")
public class EstadosResource {

    private final Logger log = LoggerFactory.getLogger(EstadosResource.class);

    private static final String ENTITY_NAME = "estados";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstadosService estadosService;

    private final EstadosRepository estadosRepository;

    public EstadosResource(EstadosService estadosService, EstadosRepository estadosRepository) {
        this.estadosService = estadosService;
        this.estadosRepository = estadosRepository;
    }

    /**
     * {@code POST  /estados} : Create a new estados.
     *
     * @param estados the estados to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estados, or with status {@code 400 (Bad Request)} if the estados has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/estados")
    public Mono<ResponseEntity<Estados>> createEstados(@Valid @RequestBody Estados estados) throws URISyntaxException {
        log.debug("REST request to save Estados : {}", estados);
        if (estados.getId() != null) {
            throw new BadRequestAlertException("A new estados cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return estadosService
            .save(estados)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/estados/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /estados/:id} : Updates an existing estados.
     *
     * @param id the id of the estados to save.
     * @param estados the estados to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estados,
     * or with status {@code 400 (Bad Request)} if the estados is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estados couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/estados/{id}")
    public Mono<ResponseEntity<Estados>> updateEstados(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Estados estados
    ) throws URISyntaxException {
        log.debug("REST request to update Estados : {}, {}", id, estados);
        if (estados.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estados.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return estadosRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return estadosService
                        .save(estados)
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
     * {@code PATCH  /estados/:id} : Partial updates given fields of an existing estados, field will ignore if it is null
     *
     * @param id the id of the estados to save.
     * @param estados the estados to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estados,
     * or with status {@code 400 (Bad Request)} if the estados is not valid,
     * or with status {@code 404 (Not Found)} if the estados is not found,
     * or with status {@code 500 (Internal Server Error)} if the estados couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/estados/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<Estados>> partialUpdateEstados(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Estados estados
    ) throws URISyntaxException {
        log.debug("REST request to partial update Estados partially : {}, {}", id, estados);
        if (estados.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estados.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return estadosRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<Estados> result = estadosService.partialUpdate(estados);

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
     * {@code GET  /estados} : get all the estados.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estados in body.
     */
    @GetMapping("/estados")
    public Mono<List<Estados>> getAllEstados() {
        log.debug("REST request to get all Estados");
        return estadosService.findAll().collectList();
    }

    /**
     * {@code GET  /estados} : get all the estados as a stream.
     * @return the {@link Flux} of estados.
     */
    @GetMapping(value = "/estados", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Estados> getAllEstadosAsStream() {
        log.debug("REST request to get all Estados as a stream");
        return estadosService.findAll();
    }

    /**
     * {@code GET  /estados/:id} : get the "id" estados.
     *
     * @param id the id of the estados to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estados, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/estados/{id}")
    public Mono<ResponseEntity<Estados>> getEstados(@PathVariable String id) {
        log.debug("REST request to get Estados : {}", id);
        Mono<Estados> estados = estadosService.findOne(id);
        return ResponseUtil.wrapOrNotFound(estados);
    }

    /**
     * {@code DELETE  /estados/:id} : delete the "id" estados.
     *
     * @param id the id of the estados to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/estados/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteEstados(@PathVariable String id) {
        log.debug("REST request to delete Estados : {}", id);
        return estadosService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
