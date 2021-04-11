package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.Cidades;
import com.smc.saude.repository.CidadesRepository;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link CidadesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class CidadesResourceIT {

    private static final String DEFAULT_CIDADE_NOME = "AAAAAAAAAA";
    private static final String UPDATED_CIDADE_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/cidades";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private CidadesRepository cidadesRepository;

    @Autowired
    private WebTestClient webTestClient;

    private Cidades cidades;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cidades createEntity() {
        Cidades cidades = new Cidades().cidadeNome(DEFAULT_CIDADE_NOME);
        return cidades;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cidades createUpdatedEntity() {
        Cidades cidades = new Cidades().cidadeNome(UPDATED_CIDADE_NOME);
        return cidades;
    }

    @BeforeEach
    public void initTest() {
        cidadesRepository.deleteAll().block();
        cidades = createEntity();
    }

    @Test
    void createCidades() throws Exception {
        int databaseSizeBeforeCreate = cidadesRepository.findAll().collectList().block().size();
        // Create the Cidades
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(cidades))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeCreate + 1);
        Cidades testCidades = cidadesList.get(cidadesList.size() - 1);
        assertThat(testCidades.getCidadeNome()).isEqualTo(DEFAULT_CIDADE_NOME);
    }

    @Test
    void createCidadesWithExistingId() throws Exception {
        // Create the Cidades with an existing ID
        cidades.setId("existing_id");

        int databaseSizeBeforeCreate = cidadesRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(cidades))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkCidadeNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = cidadesRepository.findAll().collectList().block().size();
        // set the field null
        cidades.setCidadeNome(null);

        // Create the Cidades, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(cidades))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllCidadesAsStream() {
        // Initialize the database
        cidadesRepository.save(cidades).block();

        List<Cidades> cidadesList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Cidades.class)
            .getResponseBody()
            .filter(cidades::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(cidadesList).isNotNull();
        assertThat(cidadesList).hasSize(1);
        Cidades testCidades = cidadesList.get(0);
        assertThat(testCidades.getCidadeNome()).isEqualTo(DEFAULT_CIDADE_NOME);
    }

    @Test
    void getAllCidades() {
        // Initialize the database
        cidadesRepository.save(cidades).block();

        // Get all the cidadesList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(cidades.getId()))
            .jsonPath("$.[*].cidadeNome")
            .value(hasItem(DEFAULT_CIDADE_NOME));
    }

    @Test
    void getCidades() {
        // Initialize the database
        cidadesRepository.save(cidades).block();

        // Get the cidades
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, cidades.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(cidades.getId()))
            .jsonPath("$.cidadeNome")
            .value(is(DEFAULT_CIDADE_NOME));
    }

    @Test
    void getNonExistingCidades() {
        // Get the cidades
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewCidades() throws Exception {
        // Initialize the database
        cidadesRepository.save(cidades).block();

        int databaseSizeBeforeUpdate = cidadesRepository.findAll().collectList().block().size();

        // Update the cidades
        Cidades updatedCidades = cidadesRepository.findById(cidades.getId()).block();
        updatedCidades.cidadeNome(UPDATED_CIDADE_NOME);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedCidades.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedCidades))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeUpdate);
        Cidades testCidades = cidadesList.get(cidadesList.size() - 1);
        assertThat(testCidades.getCidadeNome()).isEqualTo(UPDATED_CIDADE_NOME);
    }

    @Test
    void putNonExistingCidades() throws Exception {
        int databaseSizeBeforeUpdate = cidadesRepository.findAll().collectList().block().size();
        cidades.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, cidades.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(cidades))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCidades() throws Exception {
        int databaseSizeBeforeUpdate = cidadesRepository.findAll().collectList().block().size();
        cidades.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(cidades))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCidades() throws Exception {
        int databaseSizeBeforeUpdate = cidadesRepository.findAll().collectList().block().size();
        cidades.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(cidades))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCidadesWithPatch() throws Exception {
        // Initialize the database
        cidadesRepository.save(cidades).block();

        int databaseSizeBeforeUpdate = cidadesRepository.findAll().collectList().block().size();

        // Update the cidades using partial update
        Cidades partialUpdatedCidades = new Cidades();
        partialUpdatedCidades.setId(cidades.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCidades.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCidades))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeUpdate);
        Cidades testCidades = cidadesList.get(cidadesList.size() - 1);
        assertThat(testCidades.getCidadeNome()).isEqualTo(DEFAULT_CIDADE_NOME);
    }

    @Test
    void fullUpdateCidadesWithPatch() throws Exception {
        // Initialize the database
        cidadesRepository.save(cidades).block();

        int databaseSizeBeforeUpdate = cidadesRepository.findAll().collectList().block().size();

        // Update the cidades using partial update
        Cidades partialUpdatedCidades = new Cidades();
        partialUpdatedCidades.setId(cidades.getId());

        partialUpdatedCidades.cidadeNome(UPDATED_CIDADE_NOME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCidades.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCidades))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeUpdate);
        Cidades testCidades = cidadesList.get(cidadesList.size() - 1);
        assertThat(testCidades.getCidadeNome()).isEqualTo(UPDATED_CIDADE_NOME);
    }

    @Test
    void patchNonExistingCidades() throws Exception {
        int databaseSizeBeforeUpdate = cidadesRepository.findAll().collectList().block().size();
        cidades.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, cidades.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(cidades))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCidades() throws Exception {
        int databaseSizeBeforeUpdate = cidadesRepository.findAll().collectList().block().size();
        cidades.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(cidades))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCidades() throws Exception {
        int databaseSizeBeforeUpdate = cidadesRepository.findAll().collectList().block().size();
        cidades.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(cidades))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Cidades in the database
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCidades() {
        // Initialize the database
        cidadesRepository.save(cidades).block();

        int databaseSizeBeforeDelete = cidadesRepository.findAll().collectList().block().size();

        // Delete the cidades
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, cidades.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Cidades> cidadesList = cidadesRepository.findAll().collectList().block();
        assertThat(cidadesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
