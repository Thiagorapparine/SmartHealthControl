package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.TiposProcedimento;
import com.smc.saude.repository.TiposProcedimentoRepository;
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
 * Integration tests for the {@link TiposProcedimentoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class TiposProcedimentoResourceIT {

    private static final String DEFAULT_PROCEDIMENTO_NOME = "AAAAAAAAAA";
    private static final String UPDATED_PROCEDIMENTO_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_PROCEDIMENTO_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_PROCEDIMENTO_DESCRICAO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tipos-procedimentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private TiposProcedimentoRepository tiposProcedimentoRepository;

    @Autowired
    private WebTestClient webTestClient;

    private TiposProcedimento tiposProcedimento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TiposProcedimento createEntity() {
        TiposProcedimento tiposProcedimento = new TiposProcedimento()
            .procedimentoNome(DEFAULT_PROCEDIMENTO_NOME)
            .procedimentoDescricao(DEFAULT_PROCEDIMENTO_DESCRICAO);
        return tiposProcedimento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TiposProcedimento createUpdatedEntity() {
        TiposProcedimento tiposProcedimento = new TiposProcedimento()
            .procedimentoNome(UPDATED_PROCEDIMENTO_NOME)
            .procedimentoDescricao(UPDATED_PROCEDIMENTO_DESCRICAO);
        return tiposProcedimento;
    }

    @BeforeEach
    public void initTest() {
        tiposProcedimentoRepository.deleteAll().block();
        tiposProcedimento = createEntity();
    }

    @Test
    void createTiposProcedimento() throws Exception {
        int databaseSizeBeforeCreate = tiposProcedimentoRepository.findAll().collectList().block().size();
        // Create the TiposProcedimento
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tiposProcedimento))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeCreate + 1);
        TiposProcedimento testTiposProcedimento = tiposProcedimentoList.get(tiposProcedimentoList.size() - 1);
        assertThat(testTiposProcedimento.getProcedimentoNome()).isEqualTo(DEFAULT_PROCEDIMENTO_NOME);
        assertThat(testTiposProcedimento.getProcedimentoDescricao()).isEqualTo(DEFAULT_PROCEDIMENTO_DESCRICAO);
    }

    @Test
    void createTiposProcedimentoWithExistingId() throws Exception {
        // Create the TiposProcedimento with an existing ID
        tiposProcedimento.setId("existing_id");

        int databaseSizeBeforeCreate = tiposProcedimentoRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tiposProcedimento))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkProcedimentoNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = tiposProcedimentoRepository.findAll().collectList().block().size();
        // set the field null
        tiposProcedimento.setProcedimentoNome(null);

        // Create the TiposProcedimento, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tiposProcedimento))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllTiposProcedimentosAsStream() {
        // Initialize the database
        tiposProcedimentoRepository.save(tiposProcedimento).block();

        List<TiposProcedimento> tiposProcedimentoList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(TiposProcedimento.class)
            .getResponseBody()
            .filter(tiposProcedimento::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(tiposProcedimentoList).isNotNull();
        assertThat(tiposProcedimentoList).hasSize(1);
        TiposProcedimento testTiposProcedimento = tiposProcedimentoList.get(0);
        assertThat(testTiposProcedimento.getProcedimentoNome()).isEqualTo(DEFAULT_PROCEDIMENTO_NOME);
        assertThat(testTiposProcedimento.getProcedimentoDescricao()).isEqualTo(DEFAULT_PROCEDIMENTO_DESCRICAO);
    }

    @Test
    void getAllTiposProcedimentos() {
        // Initialize the database
        tiposProcedimentoRepository.save(tiposProcedimento).block();

        // Get all the tiposProcedimentoList
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
            .value(hasItem(tiposProcedimento.getId()))
            .jsonPath("$.[*].procedimentoNome")
            .value(hasItem(DEFAULT_PROCEDIMENTO_NOME))
            .jsonPath("$.[*].procedimentoDescricao")
            .value(hasItem(DEFAULT_PROCEDIMENTO_DESCRICAO.toString()));
    }

    @Test
    void getTiposProcedimento() {
        // Initialize the database
        tiposProcedimentoRepository.save(tiposProcedimento).block();

        // Get the tiposProcedimento
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, tiposProcedimento.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(tiposProcedimento.getId()))
            .jsonPath("$.procedimentoNome")
            .value(is(DEFAULT_PROCEDIMENTO_NOME))
            .jsonPath("$.procedimentoDescricao")
            .value(is(DEFAULT_PROCEDIMENTO_DESCRICAO.toString()));
    }

    @Test
    void getNonExistingTiposProcedimento() {
        // Get the tiposProcedimento
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewTiposProcedimento() throws Exception {
        // Initialize the database
        tiposProcedimentoRepository.save(tiposProcedimento).block();

        int databaseSizeBeforeUpdate = tiposProcedimentoRepository.findAll().collectList().block().size();

        // Update the tiposProcedimento
        TiposProcedimento updatedTiposProcedimento = tiposProcedimentoRepository.findById(tiposProcedimento.getId()).block();
        updatedTiposProcedimento.procedimentoNome(UPDATED_PROCEDIMENTO_NOME).procedimentoDescricao(UPDATED_PROCEDIMENTO_DESCRICAO);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedTiposProcedimento.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedTiposProcedimento))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeUpdate);
        TiposProcedimento testTiposProcedimento = tiposProcedimentoList.get(tiposProcedimentoList.size() - 1);
        assertThat(testTiposProcedimento.getProcedimentoNome()).isEqualTo(UPDATED_PROCEDIMENTO_NOME);
        assertThat(testTiposProcedimento.getProcedimentoDescricao()).isEqualTo(UPDATED_PROCEDIMENTO_DESCRICAO);
    }

    @Test
    void putNonExistingTiposProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = tiposProcedimentoRepository.findAll().collectList().block().size();
        tiposProcedimento.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, tiposProcedimento.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tiposProcedimento))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchTiposProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = tiposProcedimentoRepository.findAll().collectList().block().size();
        tiposProcedimento.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tiposProcedimento))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamTiposProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = tiposProcedimentoRepository.findAll().collectList().block().size();
        tiposProcedimento.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tiposProcedimento))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateTiposProcedimentoWithPatch() throws Exception {
        // Initialize the database
        tiposProcedimentoRepository.save(tiposProcedimento).block();

        int databaseSizeBeforeUpdate = tiposProcedimentoRepository.findAll().collectList().block().size();

        // Update the tiposProcedimento using partial update
        TiposProcedimento partialUpdatedTiposProcedimento = new TiposProcedimento();
        partialUpdatedTiposProcedimento.setId(tiposProcedimento.getId());

        partialUpdatedTiposProcedimento.procedimentoNome(UPDATED_PROCEDIMENTO_NOME).procedimentoDescricao(UPDATED_PROCEDIMENTO_DESCRICAO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedTiposProcedimento.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedTiposProcedimento))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeUpdate);
        TiposProcedimento testTiposProcedimento = tiposProcedimentoList.get(tiposProcedimentoList.size() - 1);
        assertThat(testTiposProcedimento.getProcedimentoNome()).isEqualTo(UPDATED_PROCEDIMENTO_NOME);
        assertThat(testTiposProcedimento.getProcedimentoDescricao()).isEqualTo(UPDATED_PROCEDIMENTO_DESCRICAO);
    }

    @Test
    void fullUpdateTiposProcedimentoWithPatch() throws Exception {
        // Initialize the database
        tiposProcedimentoRepository.save(tiposProcedimento).block();

        int databaseSizeBeforeUpdate = tiposProcedimentoRepository.findAll().collectList().block().size();

        // Update the tiposProcedimento using partial update
        TiposProcedimento partialUpdatedTiposProcedimento = new TiposProcedimento();
        partialUpdatedTiposProcedimento.setId(tiposProcedimento.getId());

        partialUpdatedTiposProcedimento.procedimentoNome(UPDATED_PROCEDIMENTO_NOME).procedimentoDescricao(UPDATED_PROCEDIMENTO_DESCRICAO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedTiposProcedimento.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedTiposProcedimento))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeUpdate);
        TiposProcedimento testTiposProcedimento = tiposProcedimentoList.get(tiposProcedimentoList.size() - 1);
        assertThat(testTiposProcedimento.getProcedimentoNome()).isEqualTo(UPDATED_PROCEDIMENTO_NOME);
        assertThat(testTiposProcedimento.getProcedimentoDescricao()).isEqualTo(UPDATED_PROCEDIMENTO_DESCRICAO);
    }

    @Test
    void patchNonExistingTiposProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = tiposProcedimentoRepository.findAll().collectList().block().size();
        tiposProcedimento.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, tiposProcedimento.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(tiposProcedimento))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchTiposProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = tiposProcedimentoRepository.findAll().collectList().block().size();
        tiposProcedimento.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(tiposProcedimento))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamTiposProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = tiposProcedimentoRepository.findAll().collectList().block().size();
        tiposProcedimento.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(tiposProcedimento))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the TiposProcedimento in the database
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteTiposProcedimento() {
        // Initialize the database
        tiposProcedimentoRepository.save(tiposProcedimento).block();

        int databaseSizeBeforeDelete = tiposProcedimentoRepository.findAll().collectList().block().size();

        // Delete the tiposProcedimento
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, tiposProcedimento.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<TiposProcedimento> tiposProcedimentoList = tiposProcedimentoRepository.findAll().collectList().block();
        assertThat(tiposProcedimentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
