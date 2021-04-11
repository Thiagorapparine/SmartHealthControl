package com.smc.saude.web.rest;

import com.smc.saude.domain.TiposProcedimento;
import com.smc.saude.repository.TiposProcedimentoRepository;
import com.smc.saude.service.TiposProcedimentoService;
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
 * REST controller for managing {@link com.smc.saude.domain.TiposProcedimento}.
 */
@RestController
@RequestMapping("/api")
public class TiposProcedimentoResource {

    private final Logger log = LoggerFactory.getLogger(TiposProcedimentoResource.class);

    private static final String ENTITY_NAME = "tiposProcedimento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TiposProcedimentoService tiposProcedimentoService;

    private final TiposProcedimentoRepository tiposProcedimentoRepository;

    public TiposProcedimentoResource(
        TiposProcedimentoService tiposProcedimentoService,
        TiposProcedimentoRepository tiposProcedimentoRepository
    ) {
        this.tiposProcedimentoService = tiposProcedimentoService;
        this.tiposProcedimentoRepository = tiposProcedimentoRepository;
    }

    /**
     * {@code POST  /tipos-procedimentos} : Create a new tiposProcedimento.
     *
     * @param tiposProcedimento the tiposProcedimento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tiposProcedimento, or with status {@code 400 (Bad Request)} if the tiposProcedimento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tipos-procedimentos")
    public Mono<ResponseEntity<TiposProcedimento>> createTiposProcedimento(@Valid @RequestBody TiposProcedimento tiposProcedimento)
        throws URISyntaxException {
        log.debug("REST request to save TiposProcedimento : {}", tiposProcedimento);
        if (tiposProcedimento.getId() != null) {
            throw new BadRequestAlertException("A new tiposProcedimento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return tiposProcedimentoService
            .save(tiposProcedimento)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/tipos-procedimentos/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /tipos-procedimentos/:id} : Updates an existing tiposProcedimento.
     *
     * @param id the id of the tiposProcedimento to save.
     * @param tiposProcedimento the tiposProcedimento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tiposProcedimento,
     * or with status {@code 400 (Bad Request)} if the tiposProcedimento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tiposProcedimento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tipos-procedimentos/{id}")
    public Mono<ResponseEntity<TiposProcedimento>> updateTiposProcedimento(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody TiposProcedimento tiposProcedimento
    ) throws URISyntaxException {
        log.debug("REST request to update TiposProcedimento : {}, {}", id, tiposProcedimento);
        if (tiposProcedimento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tiposProcedimento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return tiposProcedimentoRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return tiposProcedimentoService
                        .save(tiposProcedimento)
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
     * {@code PATCH  /tipos-procedimentos/:id} : Partial updates given fields of an existing tiposProcedimento, field will ignore if it is null
     *
     * @param id the id of the tiposProcedimento to save.
     * @param tiposProcedimento the tiposProcedimento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tiposProcedimento,
     * or with status {@code 400 (Bad Request)} if the tiposProcedimento is not valid,
     * or with status {@code 404 (Not Found)} if the tiposProcedimento is not found,
     * or with status {@code 500 (Internal Server Error)} if the tiposProcedimento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tipos-procedimentos/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<TiposProcedimento>> partialUpdateTiposProcedimento(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody TiposProcedimento tiposProcedimento
    ) throws URISyntaxException {
        log.debug("REST request to partial update TiposProcedimento partially : {}, {}", id, tiposProcedimento);
        if (tiposProcedimento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tiposProcedimento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return tiposProcedimentoRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<TiposProcedimento> result = tiposProcedimentoService.partialUpdate(tiposProcedimento);

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
     * {@code GET  /tipos-procedimentos} : get all the tiposProcedimentos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tiposProcedimentos in body.
     */
    @GetMapping("/tipos-procedimentos")
    public Mono<List<TiposProcedimento>> getAllTiposProcedimentos() {
        log.debug("REST request to get all TiposProcedimentos");
        return tiposProcedimentoService.findAll().collectList();
    }

    /**
     * {@code GET  /tipos-procedimentos} : get all the tiposProcedimentos as a stream.
     * @return the {@link Flux} of tiposProcedimentos.
     */
    @GetMapping(value = "/tipos-procedimentos", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<TiposProcedimento> getAllTiposProcedimentosAsStream() {
        log.debug("REST request to get all TiposProcedimentos as a stream");
        return tiposProcedimentoService.findAll();
    }

    /**
     * {@code GET  /tipos-procedimentos/:id} : get the "id" tiposProcedimento.
     *
     * @param id the id of the tiposProcedimento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tiposProcedimento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tipos-procedimentos/{id}")
    public Mono<ResponseEntity<TiposProcedimento>> getTiposProcedimento(@PathVariable String id) {
        log.debug("REST request to get TiposProcedimento : {}", id);
        Mono<TiposProcedimento> tiposProcedimento = tiposProcedimentoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(tiposProcedimento);
    }

    /**
     * {@code DELETE  /tipos-procedimentos/:id} : delete the "id" tiposProcedimento.
     *
     * @param id the id of the tiposProcedimento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tipos-procedimentos/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteTiposProcedimento(@PathVariable String id) {
        log.debug("REST request to delete TiposProcedimento : {}", id);
        return tiposProcedimentoService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
