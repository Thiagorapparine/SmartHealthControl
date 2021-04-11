package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.SaudeTipo;
import com.smc.saude.repository.SaudeTipoRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link SaudeTipoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class SaudeTipoResourceIT {

    private static final String DEFAULT_TIPO_IDENTIFICACAO = "AAAAAAAAAA";
    private static final String UPDATED_TIPO_IDENTIFICACAO = "BBBBBBBBBB";

    private static final String DEFAULT_TIPO_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_TIPO_DESCRICAO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/saude-tipos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SaudeTipoRepository saudeTipoRepository;

    @Autowired
    private WebTestClient webTestClient;

    private SaudeTipo saudeTipo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SaudeTipo createEntity() {
        SaudeTipo saudeTipo = new SaudeTipo().tipoIdentificacao(DEFAULT_TIPO_IDENTIFICACAO).tipoDescricao(DEFAULT_TIPO_DESCRICAO);
        return saudeTipo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SaudeTipo createUpdatedEntity() {
        SaudeTipo saudeTipo = new SaudeTipo().tipoIdentificacao(UPDATED_TIPO_IDENTIFICACAO).tipoDescricao(UPDATED_TIPO_DESCRICAO);
        return saudeTipo;
    }

    @BeforeEach
    public void initTest() {
        saudeTipoRepository.deleteAll().block();
        saudeTipo = createEntity();
    }

    @Test
    void createSaudeTipo() throws Exception {
        int databaseSizeBeforeCreate = saudeTipoRepository.findAll().collectList().block().size();
        // Create the SaudeTipo
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(saudeTipo))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeCreate + 1);
        SaudeTipo testSaudeTipo = saudeTipoList.get(saudeTipoList.size() - 1);
        assertThat(testSaudeTipo.getTipoIdentificacao()).isEqualTo(DEFAULT_TIPO_IDENTIFICACAO);
        assertThat(testSaudeTipo.getTipoDescricao()).isEqualTo(DEFAULT_TIPO_DESCRICAO);
    }

    @Test
    void createSaudeTipoWithExistingId() throws Exception {
        // Create the SaudeTipo with an existing ID
        saudeTipo.setId("existing_id");

        int databaseSizeBeforeCreate = saudeTipoRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(saudeTipo))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkTipoIdentificacaoIsRequired() throws Exception {
        int databaseSizeBeforeTest = saudeTipoRepository.findAll().collectList().block().size();
        // set the field null
        saudeTipo.setTipoIdentificacao(null);

        // Create the SaudeTipo, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(saudeTipo))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllSaudeTiposAsStream() {
        // Initialize the database
        saudeTipoRepository.save(saudeTipo).block();

        List<SaudeTipo> saudeTipoList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(SaudeTipo.class)
            .getResponseBody()
            .filter(saudeTipo::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(saudeTipoList).isNotNull();
        assertThat(saudeTipoList).hasSize(1);
        SaudeTipo testSaudeTipo = saudeTipoList.get(0);
        assertThat(testSaudeTipo.getTipoIdentificacao()).isEqualTo(DEFAULT_TIPO_IDENTIFICACAO);
        assertThat(testSaudeTipo.getTipoDescricao()).isEqualTo(DEFAULT_TIPO_DESCRICAO);
    }

    @Test
    void getAllSaudeTipos() {
        // Initialize the database
        saudeTipoRepository.save(saudeTipo).block();

        // Get all the saudeTipoList
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
            .value(hasItem(saudeTipo.getId()))
            .jsonPath("$.[*].tipoIdentificacao")
            .value(hasItem(DEFAULT_TIPO_IDENTIFICACAO))
            .jsonPath("$.[*].tipoDescricao")
            .value(hasItem(DEFAULT_TIPO_DESCRICAO.toString()));
    }

    @Test
    void getSaudeTipo() {
        // Initialize the database
        saudeTipoRepository.save(saudeTipo).block();

        // Get the saudeTipo
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, saudeTipo.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(saudeTipo.getId()))
            .jsonPath("$.tipoIdentificacao")
            .value(is(DEFAULT_TIPO_IDENTIFICACAO))
            .jsonPath("$.tipoDescricao")
            .value(is(DEFAULT_TIPO_DESCRICAO.toString()));
    }

    @Test
    void getNonExistingSaudeTipo() {
        // Get the saudeTipo
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewSaudeTipo() throws Exception {
        // Initialize the database
        saudeTipoRepository.save(saudeTipo).block();

        int databaseSizeBeforeUpdate = saudeTipoRepository.findAll().collectList().block().size();

        // Update the saudeTipo
        SaudeTipo updatedSaudeTipo = saudeTipoRepository.findById(saudeTipo.getId()).block();
        updatedSaudeTipo.tipoIdentificacao(UPDATED_TIPO_IDENTIFICACAO).tipoDescricao(UPDATED_TIPO_DESCRICAO);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedSaudeTipo.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedSaudeTipo))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeUpdate);
        SaudeTipo testSaudeTipo = saudeTipoList.get(saudeTipoList.size() - 1);
        assertThat(testSaudeTipo.getTipoIdentificacao()).isEqualTo(UPDATED_TIPO_IDENTIFICACAO);
        assertThat(testSaudeTipo.getTipoDescricao()).isEqualTo(UPDATED_TIPO_DESCRICAO);
    }

    @Test
    void putNonExistingSaudeTipo() throws Exception {
        int databaseSizeBeforeUpdate = saudeTipoRepository.findAll().collectList().block().size();
        saudeTipo.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, saudeTipo.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(saudeTipo))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSaudeTipo() throws Exception {
        int databaseSizeBeforeUpdate = saudeTipoRepository.findAll().collectList().block().size();
        saudeTipo.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(saudeTipo))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSaudeTipo() throws Exception {
        int databaseSizeBeforeUpdate = saudeTipoRepository.findAll().collectList().block().size();
        saudeTipo.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(saudeTipo))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSaudeTipoWithPatch() throws Exception {
        // Initialize the database
        saudeTipoRepository.save(saudeTipo).block();

        int databaseSizeBeforeUpdate = saudeTipoRepository.findAll().collectList().block().size();

        // Update the saudeTipo using partial update
        SaudeTipo partialUpdatedSaudeTipo = new SaudeTipo();
        partialUpdatedSaudeTipo.setId(saudeTipo.getId());

        partialUpdatedSaudeTipo.tipoIdentificacao(UPDATED_TIPO_IDENTIFICACAO).tipoDescricao(UPDATED_TIPO_DESCRICAO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSaudeTipo.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSaudeTipo))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeUpdate);
        SaudeTipo testSaudeTipo = saudeTipoList.get(saudeTipoList.size() - 1);
        assertThat(testSaudeTipo.getTipoIdentificacao()).isEqualTo(UPDATED_TIPO_IDENTIFICACAO);
        assertThat(testSaudeTipo.getTipoDescricao()).isEqualTo(UPDATED_TIPO_DESCRICAO);
    }

    @Test
    void fullUpdateSaudeTipoWithPatch() throws Exception {
        // Initialize the database
        saudeTipoRepository.save(saudeTipo).block();

        int databaseSizeBeforeUpdate = saudeTipoRepository.findAll().collectList().block().size();

        // Update the saudeTipo using partial update
        SaudeTipo partialUpdatedSaudeTipo = new SaudeTipo();
        partialUpdatedSaudeTipo.setId(saudeTipo.getId());

        partialUpdatedSaudeTipo.tipoIdentificacao(UPDATED_TIPO_IDENTIFICACAO).tipoDescricao(UPDATED_TIPO_DESCRICAO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSaudeTipo.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSaudeTipo))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeUpdate);
        SaudeTipo testSaudeTipo = saudeTipoList.get(saudeTipoList.size() - 1);
        assertThat(testSaudeTipo.getTipoIdentificacao()).isEqualTo(UPDATED_TIPO_IDENTIFICACAO);
        assertThat(testSaudeTipo.getTipoDescricao()).isEqualTo(UPDATED_TIPO_DESCRICAO);
    }

    @Test
    void patchNonExistingSaudeTipo() throws Exception {
        int databaseSizeBeforeUpdate = saudeTipoRepository.findAll().collectList().block().size();
        saudeTipo.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, saudeTipo.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(saudeTipo))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSaudeTipo() throws Exception {
        int databaseSizeBeforeUpdate = saudeTipoRepository.findAll().collectList().block().size();
        saudeTipo.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(saudeTipo))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSaudeTipo() throws Exception {
        int databaseSizeBeforeUpdate = saudeTipoRepository.findAll().collectList().block().size();
        saudeTipo.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(saudeTipo))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the SaudeTipo in the database
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSaudeTipo() {
        // Initialize the database
        saudeTipoRepository.save(saudeTipo).block();

        int databaseSizeBeforeDelete = saudeTipoRepository.findAll().collectList().block().size();

        // Delete the saudeTipo
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, saudeTipo.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<SaudeTipo> saudeTipoList = saudeTipoRepository.findAll().collectList().block();
        assertThat(saudeTipoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
