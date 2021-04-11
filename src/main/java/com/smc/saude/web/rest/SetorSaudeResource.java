package com.smc.saude.web.rest;

import com.smc.saude.domain.SetorSaude;
import com.smc.saude.repository.SetorSaudeRepository;
import com.smc.saude.service.SetorSaudeService;
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
 * REST controller for managing {@link com.smc.saude.domain.SetorSaude}.
 */
@RestController
@RequestMapping("/api")
public class SetorSaudeResource {

    private final Logger log = LoggerFactory.getLogger(SetorSaudeResource.class);

    private static final String ENTITY_NAME = "setorSaude";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SetorSaudeService setorSaudeService;

    private final SetorSaudeRepository setorSaudeRepository;

    public SetorSaudeResource(SetorSaudeService setorSaudeService, SetorSaudeRepository setorSaudeRepository) {
        this.setorSaudeService = setorSaudeService;
        this.setorSaudeRepository = setorSaudeRepository;
    }

    /**
     * {@code POST  /setor-saudes} : Create a new setorSaude.
     *
     * @param setorSaude the setorSaude to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new setorSaude, or with status {@code 400 (Bad Request)} if the setorSaude has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/setor-saudes")
    public Mono<ResponseEntity<SetorSaude>> createSetorSaude(@Valid @RequestBody SetorSaude setorSaude) throws URISyntaxException {
        log.debug("REST request to save SetorSaude : {}", setorSaude);
        if (setorSaude.getId() != null) {
            throw new BadRequestAlertException("A new setorSaude cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return setorSaudeService
            .save(setorSaude)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/setor-saudes/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /setor-saudes/:id} : Updates an existing setorSaude.
     *
     * @param id the id of the setorSaude to save.
     * @param setorSaude the setorSaude to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated setorSaude,
     * or with status {@code 400 (Bad Request)} if the setorSaude is not valid,
     * or with status {@code 500 (Internal Server Error)} if the setorSaude couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/setor-saudes/{id}")
    public Mono<ResponseEntity<SetorSaude>> updateSetorSaude(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody SetorSaude setorSaude
    ) throws URISyntaxException {
        log.debug("REST request to update SetorSaude : {}, {}", id, setorSaude);
        if (setorSaude.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, setorSaude.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return setorSaudeRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return setorSaudeService
                        .save(setorSaude)
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
     * {@code PATCH  /setor-saudes/:id} : Partial updates given fields of an existing setorSaude, field will ignore if it is null
     *
     * @param id the id of the setorSaude to save.
     * @param setorSaude the setorSaude to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated setorSaude,
     * or with status {@code 400 (Bad Request)} if the setorSaude is not valid,
     * or with status {@code 404 (Not Found)} if the setorSaude is not found,
     * or with status {@code 500 (Internal Server Error)} if the setorSaude couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/setor-saudes/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<SetorSaude>> partialUpdateSetorSaude(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody SetorSaude setorSaude
    ) throws URISyntaxException {
        log.debug("REST request to partial update SetorSaude partially : {}, {}", id, setorSaude);
        if (setorSaude.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, setorSaude.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return setorSaudeRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<SetorSaude> result = setorSaudeService.partialUpdate(setorSaude);

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
     * {@code GET  /setor-saudes} : get all the setorSaudes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of setorSaudes in body.
     */
    @GetMapping("/setor-saudes")
    public Mono<List<SetorSaude>> getAllSetorSaudes() {
        log.debug("REST request to get all SetorSaudes");
        return setorSaudeService.findAll().collectList();
    }

    /**
     * {@code GET  /setor-saudes} : get all the setorSaudes as a stream.
     * @return the {@link Flux} of setorSaudes.
     */
    @GetMapping(value = "/setor-saudes", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<SetorSaude> getAllSetorSaudesAsStream() {
        log.debug("REST request to get all SetorSaudes as a stream");
        return setorSaudeService.findAll();
    }

    /**
     * {@code GET  /setor-saudes/:id} : get the "id" setorSaude.
     *
     * @param id the id of the setorSaude to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the setorSaude, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/setor-saudes/{id}")
    public Mono<ResponseEntity<SetorSaude>> getSetorSaude(@PathVariable String id) {
        log.debug("REST request to get SetorSaude : {}", id);
        Mono<SetorSaude> setorSaude = setorSaudeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(setorSaude);
    }

    /**
     * {@code DELETE  /setor-saudes/:id} : delete the "id" setorSaude.
     *
     * @param id the id of the setorSaude to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/setor-saudes/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteSetorSaude(@PathVariable String id) {
        log.debug("REST request to delete SetorSaude : {}", id);
        return setorSaudeService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
