package com.smc.saude.web.rest;

import com.smc.saude.domain.ExamesAgenda;
import com.smc.saude.repository.ExamesAgendaRepository;
import com.smc.saude.service.ExamesAgendaService;
import com.smc.saude.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.smc.saude.domain.ExamesAgenda}.
 */
@RestController
@RequestMapping("/api")
public class ExamesAgendaResource {

    private final Logger log = LoggerFactory.getLogger(ExamesAgendaResource.class);

    private static final String ENTITY_NAME = "examesAgenda";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExamesAgendaService examesAgendaService;

    private final ExamesAgendaRepository examesAgendaRepository;

    public ExamesAgendaResource(ExamesAgendaService examesAgendaService, ExamesAgendaRepository examesAgendaRepository) {
        this.examesAgendaService = examesAgendaService;
        this.examesAgendaRepository = examesAgendaRepository;
    }

    /**
     * {@code POST  /exames-agenda} : Create a new examesAgenda.
     *
     * @param examesAgenda the examesAgenda to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new examesAgenda, or with status {@code 400 (Bad Request)} if the examesAgenda has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/exames-agenda")
    public Mono<ResponseEntity<ExamesAgenda>> createExamesAgenda(@Valid @RequestBody ExamesAgenda examesAgenda) throws URISyntaxException {
        log.debug("REST request to save ExamesAgenda : {}", examesAgenda);
        if (examesAgenda.getId() != null) {
            throw new BadRequestAlertException("A new examesAgenda cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return examesAgendaService
            .save(examesAgenda)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/exames-agenda/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /exames-agenda/:id} : Updates an existing examesAgenda.
     *
     * @param id the id of the examesAgenda to save.
     * @param examesAgenda the examesAgenda to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examesAgenda,
     * or with status {@code 400 (Bad Request)} if the examesAgenda is not valid,
     * or with status {@code 500 (Internal Server Error)} if the examesAgenda couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/exames-agenda/{id}")
    public Mono<ResponseEntity<ExamesAgenda>> updateExamesAgenda(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody ExamesAgenda examesAgenda
    ) throws URISyntaxException {
        log.debug("REST request to update ExamesAgenda : {}, {}", id, examesAgenda);
        if (examesAgenda.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, examesAgenda.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return examesAgendaRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return examesAgendaService
                        .save(examesAgenda)
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
     * {@code PATCH  /exames-agenda/:id} : Partial updates given fields of an existing examesAgenda, field will ignore if it is null
     *
     * @param id the id of the examesAgenda to save.
     * @param examesAgenda the examesAgenda to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examesAgenda,
     * or with status {@code 400 (Bad Request)} if the examesAgenda is not valid,
     * or with status {@code 404 (Not Found)} if the examesAgenda is not found,
     * or with status {@code 500 (Internal Server Error)} if the examesAgenda couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/exames-agenda/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<ExamesAgenda>> partialUpdateExamesAgenda(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody ExamesAgenda examesAgenda
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExamesAgenda partially : {}, {}", id, examesAgenda);
        if (examesAgenda.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, examesAgenda.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return examesAgendaRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<ExamesAgenda> result = examesAgendaService.partialUpdate(examesAgenda);

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
     * {@code GET  /exames-agenda} : get all the examesAgenda.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of examesAgenda in body.
     */
    @GetMapping("/exames-agenda")
    public Mono<ResponseEntity<List<ExamesAgenda>>> getAllExamesAgenda(Pageable pageable, ServerHttpRequest request) {
        log.debug("REST request to get a page of ExamesAgenda");
        return examesAgendaService
            .countAll()
            .zipWith(examesAgendaService.findAll(pageable).collectList())
            .map(
                countWithEntities -> {
                    return ResponseEntity
                        .ok()
                        .headers(
                            PaginationUtil.generatePaginationHttpHeaders(
                                UriComponentsBuilder.fromHttpRequest(request),
                                new PageImpl<>(countWithEntities.getT2(), pageable, countWithEntities.getT1())
                            )
                        )
                        .body(countWithEntities.getT2());
                }
            );
    }

    /**
     * {@code GET  /exames-agenda/:id} : get the "id" examesAgenda.
     *
     * @param id the id of the examesAgenda to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the examesAgenda, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/exames-agenda/{id}")
    public Mono<ResponseEntity<ExamesAgenda>> getExamesAgenda(@PathVariable String id) {
        log.debug("REST request to get ExamesAgenda : {}", id);
        Mono<ExamesAgenda> examesAgenda = examesAgendaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(examesAgenda);
    }

    /**
     * {@code DELETE  /exames-agenda/:id} : delete the "id" examesAgenda.
     *
     * @param id the id of the examesAgenda to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/exames-agenda/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteExamesAgenda(@PathVariable String id) {
        log.debug("REST request to delete ExamesAgenda : {}", id);
        return examesAgendaService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
