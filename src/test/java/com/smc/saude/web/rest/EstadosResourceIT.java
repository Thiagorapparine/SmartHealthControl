package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.Estados;
import com.smc.saude.repository.EstadosRepository;
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
 * Integration tests for the {@link EstadosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class EstadosResourceIT {

    private static final String DEFAULT_ESTADOS_NOME = "AAAAAAAAAA";
    private static final String UPDATED_ESTADOS_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_ESTADOS_SIGLA = "AAAAAAAAAA";
    private static final String UPDATED_ESTADOS_SIGLA = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/estados";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private EstadosRepository estadosRepository;

    @Autowired
    private WebTestClient webTestClient;

    private Estados estados;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estados createEntity() {
        Estados estados = new Estados().estadosNome(DEFAULT_ESTADOS_NOME).estadosSigla(DEFAULT_ESTADOS_SIGLA);
        return estados;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estados createUpdatedEntity() {
        Estados estados = new Estados().estadosNome(UPDATED_ESTADOS_NOME).estadosSigla(UPDATED_ESTADOS_SIGLA);
        return estados;
    }

    @BeforeEach
    public void initTest() {
        estadosRepository.deleteAll().block();
        estados = createEntity();
    }

    @Test
    void createEstados() throws Exception {
        int databaseSizeBeforeCreate = estadosRepository.findAll().collectList().block().size();
        // Create the Estados
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeCreate + 1);
        Estados testEstados = estadosList.get(estadosList.size() - 1);
        assertThat(testEstados.getEstadosNome()).isEqualTo(DEFAULT_ESTADOS_NOME);
        assertThat(testEstados.getEstadosSigla()).isEqualTo(DEFAULT_ESTADOS_SIGLA);
    }

    @Test
    void createEstadosWithExistingId() throws Exception {
        // Create the Estados with an existing ID
        estados.setId("existing_id");

        int databaseSizeBeforeCreate = estadosRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkEstadosNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = estadosRepository.findAll().collectList().block().size();
        // set the field null
        estados.setEstadosNome(null);

        // Create the Estados, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkEstadosSiglaIsRequired() throws Exception {
        int databaseSizeBeforeTest = estadosRepository.findAll().collectList().block().size();
        // set the field null
        estados.setEstadosSigla(null);

        // Create the Estados, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllEstadosAsStream() {
        // Initialize the database
        estadosRepository.save(estados).block();

        List<Estados> estadosList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Estados.class)
            .getResponseBody()
            .filter(estados::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(estadosList).isNotNull();
        assertThat(estadosList).hasSize(1);
        Estados testEstados = estadosList.get(0);
        assertThat(testEstados.getEstadosNome()).isEqualTo(DEFAULT_ESTADOS_NOME);
        assertThat(testEstados.getEstadosSigla()).isEqualTo(DEFAULT_ESTADOS_SIGLA);
    }

    @Test
    void getAllEstados() {
        // Initialize the database
        estadosRepository.save(estados).block();

        // Get all the estadosList
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
            .value(hasItem(estados.getId()))
            .jsonPath("$.[*].estadosNome")
            .value(hasItem(DEFAULT_ESTADOS_NOME))
            .jsonPath("$.[*].estadosSigla")
            .value(hasItem(DEFAULT_ESTADOS_SIGLA));
    }

    @Test
    void getEstados() {
        // Initialize the database
        estadosRepository.save(estados).block();

        // Get the estados
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, estados.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(estados.getId()))
            .jsonPath("$.estadosNome")
            .value(is(DEFAULT_ESTADOS_NOME))
            .jsonPath("$.estadosSigla")
            .value(is(DEFAULT_ESTADOS_SIGLA));
    }

    @Test
    void getNonExistingEstados() {
        // Get the estados
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewEstados() throws Exception {
        // Initialize the database
        estadosRepository.save(estados).block();

        int databaseSizeBeforeUpdate = estadosRepository.findAll().collectList().block().size();

        // Update the estados
        Estados updatedEstados = estadosRepository.findById(estados.getId()).block();
        updatedEstados.estadosNome(UPDATED_ESTADOS_NOME).estadosSigla(UPDATED_ESTADOS_SIGLA);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedEstados.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedEstados))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeUpdate);
        Estados testEstados = estadosList.get(estadosList.size() - 1);
        assertThat(testEstados.getEstadosNome()).isEqualTo(UPDATED_ESTADOS_NOME);
        assertThat(testEstados.getEstadosSigla()).isEqualTo(UPDATED_ESTADOS_SIGLA);
    }

    @Test
    void putNonExistingEstados() throws Exception {
        int databaseSizeBeforeUpdate = estadosRepository.findAll().collectList().block().size();
        estados.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, estados.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchEstados() throws Exception {
        int databaseSizeBeforeUpdate = estadosRepository.findAll().collectList().block().size();
        estados.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamEstados() throws Exception {
        int databaseSizeBeforeUpdate = estadosRepository.findAll().collectList().block().size();
        estados.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateEstadosWithPatch() throws Exception {
        // Initialize the database
        estadosRepository.save(estados).block();

        int databaseSizeBeforeUpdate = estadosRepository.findAll().collectList().block().size();

        // Update the estados using partial update
        Estados partialUpdatedEstados = new Estados();
        partialUpdatedEstados.setId(estados.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEstados.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEstados))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeUpdate);
        Estados testEstados = estadosList.get(estadosList.size() - 1);
        assertThat(testEstados.getEstadosNome()).isEqualTo(DEFAULT_ESTADOS_NOME);
        assertThat(testEstados.getEstadosSigla()).isEqualTo(DEFAULT_ESTADOS_SIGLA);
    }

    @Test
    void fullUpdateEstadosWithPatch() throws Exception {
        // Initialize the database
        estadosRepository.save(estados).block();

        int databaseSizeBeforeUpdate = estadosRepository.findAll().collectList().block().size();

        // Update the estados using partial update
        Estados partialUpdatedEstados = new Estados();
        partialUpdatedEstados.setId(estados.getId());

        partialUpdatedEstados.estadosNome(UPDATED_ESTADOS_NOME).estadosSigla(UPDATED_ESTADOS_SIGLA);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEstados.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEstados))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeUpdate);
        Estados testEstados = estadosList.get(estadosList.size() - 1);
        assertThat(testEstados.getEstadosNome()).isEqualTo(UPDATED_ESTADOS_NOME);
        assertThat(testEstados.getEstadosSigla()).isEqualTo(UPDATED_ESTADOS_SIGLA);
    }

    @Test
    void patchNonExistingEstados() throws Exception {
        int databaseSizeBeforeUpdate = estadosRepository.findAll().collectList().block().size();
        estados.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, estados.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchEstados() throws Exception {
        int databaseSizeBeforeUpdate = estadosRepository.findAll().collectList().block().size();
        estados.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamEstados() throws Exception {
        int databaseSizeBeforeUpdate = estadosRepository.findAll().collectList().block().size();
        estados.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(estados))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Estados in the database
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteEstados() {
        // Initialize the database
        estadosRepository.save(estados).block();

        int databaseSizeBeforeDelete = estadosRepository.findAll().collectList().block().size();

        // Delete the estados
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, estados.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Estados> estadosList = estadosRepository.findAll().collectList().block();
        assertThat(estadosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
