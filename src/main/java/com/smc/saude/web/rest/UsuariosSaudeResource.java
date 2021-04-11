package com.smc.saude.web.rest;

import com.smc.saude.domain.UsuariosSaude;
import com.smc.saude.repository.UsuariosSaudeRepository;
import com.smc.saude.service.UsuariosSaudeService;
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
 * REST controller for managing {@link com.smc.saude.domain.UsuariosSaude}.
 */
@RestController
@RequestMapping("/api")
public class UsuariosSaudeResource {

    private final Logger log = LoggerFactory.getLogger(UsuariosSaudeResource.class);

    private static final String ENTITY_NAME = "usuariosSaude";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UsuariosSaudeService usuariosSaudeService;

    private final UsuariosSaudeRepository usuariosSaudeRepository;

    public UsuariosSaudeResource(UsuariosSaudeService usuariosSaudeService, UsuariosSaudeRepository usuariosSaudeRepository) {
        this.usuariosSaudeService = usuariosSaudeService;
        this.usuariosSaudeRepository = usuariosSaudeRepository;
    }

    /**
     * {@code POST  /usuarios-saudes} : Create a new usuariosSaude.
     *
     * @param usuariosSaude the usuariosSaude to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new usuariosSaude, or with status {@code 400 (Bad Request)} if the usuariosSaude has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/usuarios-saudes")
    public Mono<ResponseEntity<UsuariosSaude>> createUsuariosSaude(@Valid @RequestBody UsuariosSaude usuariosSaude)
        throws URISyntaxException {
        log.debug("REST request to save UsuariosSaude : {}", usuariosSaude);
        if (usuariosSaude.getId() != null) {
            throw new BadRequestAlertException("A new usuariosSaude cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return usuariosSaudeService
            .save(usuariosSaude)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/usuarios-saudes/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /usuarios-saudes/:id} : Updates an existing usuariosSaude.
     *
     * @param id the id of the usuariosSaude to save.
     * @param usuariosSaude the usuariosSaude to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuariosSaude,
     * or with status {@code 400 (Bad Request)} if the usuariosSaude is not valid,
     * or with status {@code 500 (Internal Server Error)} if the usuariosSaude couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/usuarios-saudes/{id}")
    public Mono<ResponseEntity<UsuariosSaude>> updateUsuariosSaude(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody UsuariosSaude usuariosSaude
    ) throws URISyntaxException {
        log.debug("REST request to update UsuariosSaude : {}, {}", id, usuariosSaude);
        if (usuariosSaude.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usuariosSaude.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return usuariosSaudeRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return usuariosSaudeService
                        .save(usuariosSaude)
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
     * {@code PATCH  /usuarios-saudes/:id} : Partial updates given fields of an existing usuariosSaude, field will ignore if it is null
     *
     * @param id the id of the usuariosSaude to save.
     * @param usuariosSaude the usuariosSaude to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuariosSaude,
     * or with status {@code 400 (Bad Request)} if the usuariosSaude is not valid,
     * or with status {@code 404 (Not Found)} if the usuariosSaude is not found,
     * or with status {@code 500 (Internal Server Error)} if the usuariosSaude couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/usuarios-saudes/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<UsuariosSaude>> partialUpdateUsuariosSaude(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody UsuariosSaude usuariosSaude
    ) throws URISyntaxException {
        log.debug("REST request to partial update UsuariosSaude partially : {}, {}", id, usuariosSaude);
        if (usuariosSaude.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usuariosSaude.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return usuariosSaudeRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<UsuariosSaude> result = usuariosSaudeService.partialUpdate(usuariosSaude);

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
     * {@code GET  /usuarios-saudes} : get all the usuariosSaudes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of usuariosSaudes in body.
     */
    @GetMapping("/usuarios-saudes")
    public Mono<List<UsuariosSaude>> getAllUsuariosSaudes() {
        log.debug("REST request to get all UsuariosSaudes");
        return usuariosSaudeService.findAll().collectList();
    }

    /**
     * {@code GET  /usuarios-saudes} : get all the usuariosSaudes as a stream.
     * @return the {@link Flux} of usuariosSaudes.
     */
    @GetMapping(value = "/usuarios-saudes", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<UsuariosSaude> getAllUsuariosSaudesAsStream() {
        log.debug("REST request to get all UsuariosSaudes as a stream");
        return usuariosSaudeService.findAll();
    }

    /**
     * {@code GET  /usuarios-saudes/:id} : get the "id" usuariosSaude.
     *
     * @param id the id of the usuariosSaude to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the usuariosSaude, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/usuarios-saudes/{id}")
    public Mono<ResponseEntity<UsuariosSaude>> getUsuariosSaude(@PathVariable String id) {
        log.debug("REST request to get UsuariosSaude : {}", id);
        Mono<UsuariosSaude> usuariosSaude = usuariosSaudeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(usuariosSaude);
    }

    /**
     * {@code DELETE  /usuarios-saudes/:id} : delete the "id" usuariosSaude.
     *
     * @param id the id of the usuariosSaude to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/usuarios-saudes/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteUsuariosSaude(@PathVariable String id) {
        log.debug("REST request to delete UsuariosSaude : {}", id);
        return usuariosSaudeService
            .delete(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
