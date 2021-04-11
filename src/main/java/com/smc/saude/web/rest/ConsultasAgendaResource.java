package com.smc.saude.web.rest;

import com.smc.saude.domain.ConsultasAgenda;
import com.smc.saude.repository.ConsultasAgendaRepository;
import com.smc.saude.service.ConsultasAgendaService;
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
 * REST controller for managing {@link com.smc.saude.domain.ConsultasAgenda}.
 */
@RestController
@RequestMapping("/api")
public class ConsultasAgendaResource {

    private final Logger log = LoggerFactory.getLogger(ConsultasAgendaResource.class);

    private static final String ENTITY_NAME = "consultasAgenda";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConsultasAgendaService consultasAgendaService;

    private final ConsultasAgendaRepository consultasAgendaRepository;

    public ConsultasAgendaResource(ConsultasAgendaService consultasAgendaService, ConsultasAgendaRepository consultasAgendaRepository) {
        this.consultasAgendaService = consultasAgendaService;
        this.consultasAgendaRepository = consultasAgendaRepository;
    }

    /**
     * {@code POST  /consultas-agenda} : Create a new consultasAgenda.
     *
     * @param consultasAgenda the consultasAgenda to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new consultasAgenda, or with status {@code 400 (Bad Request)} if the consultasAgenda has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/consultas-agenda")
    public Mono<ResponseEntity<ConsultasAgenda>> createConsultasAgenda(@Valid @RequestBody ConsultasAgenda consultasAgenda)
        throws URISyntaxException {
        log.debug("REST request to save ConsultasAgenda : {}", consultasAgenda);
        if (consultasAgenda.getId() != null) {
            throw new BadRequestAlertException("A new consultasAgenda cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return consultasAgendaService
            .save(consultasAgenda)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/consultas-agenda/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /consultas-agenda/:id} : Updates an existing consultasAgenda.
     *
     * @param id the id of the consultasAgenda to save.
     * @param consultasAgenda the consultasAgenda to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consultasAgenda,
     * or with status {@code 400 (Bad Request)} if the consultasAgenda is not valid,
     * or with status {@code 500 (Internal Server Error)} if the consultasAgenda couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/consultas-agenda/{id}")
    public Mono<ResponseEntity<ConsultasAgenda>> updateConsultasAgenda(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody ConsultasAgenda consultasAgenda
    ) throws URISyntaxException {
        log.debug("REST request to update ConsultasAgenda : {}, {}", id, consultasAgenda);
        if (consultasAgenda.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consultasAgenda.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return consultasAgendaRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return consultasAgendaService
                        .save(consultasAgenda)
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
     * {@code PATCH  /consultas-agenda/:id} : Partial updates given fields of an existing consultasAgenda, field will ignore if it is null
     *
     * @param id the id of the consultasAgenda to save.
     * @param consultasAgenda the consultasAgenda to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consultasAgenda,
     * or with status {@code 400 (Bad Request)} if the consultasAgenda is not valid,
     * or with status {@code 404 (Not Found)} if the consultasAgenda is not found,
     * or with status {@code 500 (Internal Server Error)} if the consultasAgenda couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/consultas-agenda/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<ConsultasAgenda>> partialUpdateConsultasAgenda(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody ConsultasAgenda consultasAgenda
    ) throws URISyntaxException {
        log.debug("REST request to partial update ConsultasAgenda partially : {}, {}", id, consultasAgenda);
        if (consultasAgenda.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consultasAgenda.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return consultasAgendaRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<ConsultasAgenda> result = consultasAgendaService.partialUpdate(consultasAgenda);

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
     * {@code GET  /consultas-agenda} : get all the consultasAgenda.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of consultasAgenda in body.
     */
    @GetMapping("/consultas-agenda")
    public Mono<ResponseEntity<List<ConsultasAgenda>>> getAllConsultasAgenda(Pageable pageable, ServerHttpRequest request) {
        log.debug("REST request to get a page of ConsultasAgenda");
        return consultasAgendaService
            .countAll()
            .zipWith(consultasAgendaService.findAll(pageable).collectList())
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
     * {@code GET  /consultas-agenda/:id} : get the "id" consultasAgenda.
     *
     * @param id the id of the consultasAgenda to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the consultasAgenda, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/consultas-agenda/{id}")
    public Mono<ResponseEntity<ConsultasAgenda>> getConsultasAgenda(@PathVariable String id) {
        log.debug("REST request to get ConsultasAgenda : {}", id);
        Mono<ConsultasAgenda> consultasAgenda = consultasAgendaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(consultasAgenda);
    }

    /**
     * {@code DELETE  /consultas-agenda/:id} : delete the "id" consultasAgenda.
     *
     * @param id the id of the consultasAgenda to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/consultas-agenda/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteConsultasAgenda(@PathVariable String id) {
        log.debug("REST request to delete ConsultasAgenda : {}", id);
        return consultasAgendaService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
