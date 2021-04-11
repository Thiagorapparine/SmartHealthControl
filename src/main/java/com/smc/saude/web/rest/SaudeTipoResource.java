package com.smc.saude.web.rest;

import com.smc.saude.domain.SaudeTipo;
import com.smc.saude.repository.SaudeTipoRepository;
import com.smc.saude.service.SaudeTipoService;
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
 * REST controller for managing {@link com.smc.saude.domain.SaudeTipo}.
 */
@RestController
@RequestMapping("/api")
public class SaudeTipoResource {

    private final Logger log = LoggerFactory.getLogger(SaudeTipoResource.class);

    private static final String ENTITY_NAME = "saudeTipo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SaudeTipoService saudeTipoService;

    private final SaudeTipoRepository saudeTipoRepository;

    public SaudeTipoResource(SaudeTipoService saudeTipoService, SaudeTipoRepository saudeTipoRepository) {
        this.saudeTipoService = saudeTipoService;
        this.saudeTipoRepository = saudeTipoRepository;
    }

    /**
     * {@code POST  /saude-tipos} : Create a new saudeTipo.
     *
     * @param saudeTipo the saudeTipo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new saudeTipo, or with status {@code 400 (Bad Request)} if the saudeTipo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/saude-tipos")
    public Mono<ResponseEntity<SaudeTipo>> createSaudeTipo(@Valid @RequestBody SaudeTipo saudeTipo) throws URISyntaxException {
        log.debug("REST request to save SaudeTipo : {}", saudeTipo);
        if (saudeTipo.getId() != null) {
            throw new BadRequestAlertException("A new saudeTipo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return saudeTipoService
            .save(saudeTipo)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/saude-tipos/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /saude-tipos/:id} : Updates an existing saudeTipo.
     *
     * @param id the id of the saudeTipo to save.
     * @param saudeTipo the saudeTipo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated saudeTipo,
     * or with status {@code 400 (Bad Request)} if the saudeTipo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the saudeTipo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/saude-tipos/{id}")
    public Mono<ResponseEntity<SaudeTipo>> updateSaudeTipo(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody SaudeTipo saudeTipo
    ) throws URISyntaxException {
        log.debug("REST request to update SaudeTipo : {}, {}", id, saudeTipo);
        if (saudeTipo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, saudeTipo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return saudeTipoRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return saudeTipoService
                        .save(saudeTipo)
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
     * {@code PATCH  /saude-tipos/:id} : Partial updates given fields of an existing saudeTipo, field will ignore if it is null
     *
     * @param id the id of the saudeTipo to save.
     * @param saudeTipo the saudeTipo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated saudeTipo,
     * or with status {@code 400 (Bad Request)} if the saudeTipo is not valid,
     * or with status {@code 404 (Not Found)} if the saudeTipo is not found,
     * or with status {@code 500 (Internal Server Error)} if the saudeTipo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/saude-tipos/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<SaudeTipo>> partialUpdateSaudeTipo(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody SaudeTipo saudeTipo
    ) throws URISyntaxException {
        log.debug("REST request to partial update SaudeTipo partially : {}, {}", id, saudeTipo);
        if (saudeTipo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, saudeTipo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return saudeTipoRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<SaudeTipo> result = saudeTipoService.partialUpdate(saudeTipo);

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
     * {@code GET  /saude-tipos} : get all the saudeTipos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of saudeTipos in body.
     */
    @GetMapping("/saude-tipos")
    public Mono<List<SaudeTipo>> getAllSaudeTipos() {
        log.debug("REST request to get all SaudeTipos");
        return saudeTipoService.findAll().collectList();
    }

    /**
     * {@code GET  /saude-tipos} : get all the saudeTipos as a stream.
     * @return the {@link Flux} of saudeTipos.
     */
    @GetMapping(value = "/saude-tipos", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<SaudeTipo> getAllSaudeTiposAsStream() {
        log.debug("REST request to get all SaudeTipos as a stream");
        return saudeTipoService.findAll();
    }

    /**
     * {@code GET  /saude-tipos/:id} : get the "id" saudeTipo.
     *
     * @param id the id of the saudeTipo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the saudeTipo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/saude-tipos/{id}")
    public Mono<ResponseEntity<SaudeTipo>> getSaudeTipo(@PathVariable String id) {
        log.debug("REST request to get SaudeTipo : {}", id);
        Mono<SaudeTipo> saudeTipo = saudeTipoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(saudeTipo);
    }

    /**
     * {@code DELETE  /saude-tipos/:id} : delete the "id" saudeTipo.
     *
     * @param id the id of the saudeTipo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/saude-tipos/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteSaudeTipo(@PathVariable String id) {
        log.debug("REST request to delete SaudeTipo : {}", id);
        return saudeTipoService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
