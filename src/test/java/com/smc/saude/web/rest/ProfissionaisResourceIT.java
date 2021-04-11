package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.Profissionais;
import com.smc.saude.repository.ProfissionaisRepository;
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
 * Integration tests for the {@link ProfissionaisResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class ProfissionaisResourceIT {

    private static final String DEFAULT_PROFISSIONAL_NOME = "AAAAAAAAAA";
    private static final String UPDATED_PROFISSIONAL_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_PROFISSIONAL_HORA_INICIO = "10:32";
    private static final String UPDATED_PROFISSIONAL_HORA_INICIO = "12:24";

    private static final String DEFAULT_PROFISSIONAL_HORA_FIM = "08:44";
    private static final String UPDATED_PROFISSIONAL_HORA_FIM = "22:09";

    private static final String ENTITY_API_URL = "/api/profissionais";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ProfissionaisRepository profissionaisRepository;

    @Autowired
    private WebTestClient webTestClient;

    private Profissionais profissionais;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Profissionais createEntity() {
        Profissionais profissionais = new Profissionais()
            .profissionalNome(DEFAULT_PROFISSIONAL_NOME)
            .profissionalHoraInicio(DEFAULT_PROFISSIONAL_HORA_INICIO)
            .profissionalHoraFim(DEFAULT_PROFISSIONAL_HORA_FIM);
        return profissionais;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Profissionais createUpdatedEntity() {
        Profissionais profissionais = new Profissionais()
            .profissionalNome(UPDATED_PROFISSIONAL_NOME)
            .profissionalHoraInicio(UPDATED_PROFISSIONAL_HORA_INICIO)
            .profissionalHoraFim(UPDATED_PROFISSIONAL_HORA_FIM);
        return profissionais;
    }

    @BeforeEach
    public void initTest() {
        profissionaisRepository.deleteAll().block();
        profissionais = createEntity();
    }

    @Test
    void createProfissionais() throws Exception {
        int databaseSizeBeforeCreate = profissionaisRepository.findAll().collectList().block().size();
        // Create the Profissionais
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeCreate + 1);
        Profissionais testProfissionais = profissionaisList.get(profissionaisList.size() - 1);
        assertThat(testProfissionais.getProfissionalNome()).isEqualTo(DEFAULT_PROFISSIONAL_NOME);
        assertThat(testProfissionais.getProfissionalHoraInicio()).isEqualTo(DEFAULT_PROFISSIONAL_HORA_INICIO);
        assertThat(testProfissionais.getProfissionalHoraFim()).isEqualTo(DEFAULT_PROFISSIONAL_HORA_FIM);
    }

    @Test
    void createProfissionaisWithExistingId() throws Exception {
        // Create the Profissionais with an existing ID
        profissionais.setId("existing_id");

        int databaseSizeBeforeCreate = profissionaisRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkProfissionalNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = profissionaisRepository.findAll().collectList().block().size();
        // set the field null
        profissionais.setProfissionalNome(null);

        // Create the Profissionais, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkProfissionalHoraInicioIsRequired() throws Exception {
        int databaseSizeBeforeTest = profissionaisRepository.findAll().collectList().block().size();
        // set the field null
        profissionais.setProfissionalHoraInicio(null);

        // Create the Profissionais, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkProfissionalHoraFimIsRequired() throws Exception {
        int databaseSizeBeforeTest = profissionaisRepository.findAll().collectList().block().size();
        // set the field null
        profissionais.setProfissionalHoraFim(null);

        // Create the Profissionais, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllProfissionaisAsStream() {
        // Initialize the database
        profissionaisRepository.save(profissionais).block();

        List<Profissionais> profissionaisList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Profissionais.class)
            .getResponseBody()
            .filter(profissionais::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(profissionaisList).isNotNull();
        assertThat(profissionaisList).hasSize(1);
        Profissionais testProfissionais = profissionaisList.get(0);
        assertThat(testProfissionais.getProfissionalNome()).isEqualTo(DEFAULT_PROFISSIONAL_NOME);
        assertThat(testProfissionais.getProfissionalHoraInicio()).isEqualTo(DEFAULT_PROFISSIONAL_HORA_INICIO);
        assertThat(testProfissionais.getProfissionalHoraFim()).isEqualTo(DEFAULT_PROFISSIONAL_HORA_FIM);
    }

    @Test
    void getAllProfissionais() {
        // Initialize the database
        profissionaisRepository.save(profissionais).block();

        // Get all the profissionaisList
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
            .value(hasItem(profissionais.getId()))
            .jsonPath("$.[*].profissionalNome")
            .value(hasItem(DEFAULT_PROFISSIONAL_NOME))
            .jsonPath("$.[*].profissionalHoraInicio")
            .value(hasItem(DEFAULT_PROFISSIONAL_HORA_INICIO))
            .jsonPath("$.[*].profissionalHoraFim")
            .value(hasItem(DEFAULT_PROFISSIONAL_HORA_FIM));
    }

    @Test
    void getProfissionais() {
        // Initialize the database
        profissionaisRepository.save(profissionais).block();

        // Get the profissionais
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, profissionais.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(profissionais.getId()))
            .jsonPath("$.profissionalNome")
            .value(is(DEFAULT_PROFISSIONAL_NOME))
            .jsonPath("$.profissionalHoraInicio")
            .value(is(DEFAULT_PROFISSIONAL_HORA_INICIO))
            .jsonPath("$.profissionalHoraFim")
            .value(is(DEFAULT_PROFISSIONAL_HORA_FIM));
    }

    @Test
    void getNonExistingProfissionais() {
        // Get the profissionais
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewProfissionais() throws Exception {
        // Initialize the database
        profissionaisRepository.save(profissionais).block();

        int databaseSizeBeforeUpdate = profissionaisRepository.findAll().collectList().block().size();

        // Update the profissionais
        Profissionais updatedProfissionais = profissionaisRepository.findById(profissionais.getId()).block();
        updatedProfissionais
            .profissionalNome(UPDATED_PROFISSIONAL_NOME)
            .profissionalHoraInicio(UPDATED_PROFISSIONAL_HORA_INICIO)
            .profissionalHoraFim(UPDATED_PROFISSIONAL_HORA_FIM);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedProfissionais.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedProfissionais))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeUpdate);
        Profissionais testProfissionais = profissionaisList.get(profissionaisList.size() - 1);
        assertThat(testProfissionais.getProfissionalNome()).isEqualTo(UPDATED_PROFISSIONAL_NOME);
        assertThat(testProfissionais.getProfissionalHoraInicio()).isEqualTo(UPDATED_PROFISSIONAL_HORA_INICIO);
        assertThat(testProfissionais.getProfissionalHoraFim()).isEqualTo(UPDATED_PROFISSIONAL_HORA_FIM);
    }

    @Test
    void putNonExistingProfissionais() throws Exception {
        int databaseSizeBeforeUpdate = profissionaisRepository.findAll().collectList().block().size();
        profissionais.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, profissionais.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchProfissionais() throws Exception {
        int databaseSizeBeforeUpdate = profissionaisRepository.findAll().collectList().block().size();
        profissionais.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamProfissionais() throws Exception {
        int databaseSizeBeforeUpdate = profissionaisRepository.findAll().collectList().block().size();
        profissionais.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateProfissionaisWithPatch() throws Exception {
        // Initialize the database
        profissionaisRepository.save(profissionais).block();

        int databaseSizeBeforeUpdate = profissionaisRepository.findAll().collectList().block().size();

        // Update the profissionais using partial update
        Profissionais partialUpdatedProfissionais = new Profissionais();
        partialUpdatedProfissionais.setId(profissionais.getId());

        partialUpdatedProfissionais.profissionalNome(UPDATED_PROFISSIONAL_NOME).profissionalHoraFim(UPDATED_PROFISSIONAL_HORA_FIM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedProfissionais.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedProfissionais))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeUpdate);
        Profissionais testProfissionais = profissionaisList.get(profissionaisList.size() - 1);
        assertThat(testProfissionais.getProfissionalNome()).isEqualTo(UPDATED_PROFISSIONAL_NOME);
        assertThat(testProfissionais.getProfissionalHoraInicio()).isEqualTo(DEFAULT_PROFISSIONAL_HORA_INICIO);
        assertThat(testProfissionais.getProfissionalHoraFim()).isEqualTo(UPDATED_PROFISSIONAL_HORA_FIM);
    }

    @Test
    void fullUpdateProfissionaisWithPatch() throws Exception {
        // Initialize the database
        profissionaisRepository.save(profissionais).block();

        int databaseSizeBeforeUpdate = profissionaisRepository.findAll().collectList().block().size();

        // Update the profissionais using partial update
        Profissionais partialUpdatedProfissionais = new Profissionais();
        partialUpdatedProfissionais.setId(profissionais.getId());

        partialUpdatedProfissionais
            .profissionalNome(UPDATED_PROFISSIONAL_NOME)
            .profissionalHoraInicio(UPDATED_PROFISSIONAL_HORA_INICIO)
            .profissionalHoraFim(UPDATED_PROFISSIONAL_HORA_FIM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedProfissionais.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedProfissionais))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeUpdate);
        Profissionais testProfissionais = profissionaisList.get(profissionaisList.size() - 1);
        assertThat(testProfissionais.getProfissionalNome()).isEqualTo(UPDATED_PROFISSIONAL_NOME);
        assertThat(testProfissionais.getProfissionalHoraInicio()).isEqualTo(UPDATED_PROFISSIONAL_HORA_INICIO);
        assertThat(testProfissionais.getProfissionalHoraFim()).isEqualTo(UPDATED_PROFISSIONAL_HORA_FIM);
    }

    @Test
    void patchNonExistingProfissionais() throws Exception {
        int databaseSizeBeforeUpdate = profissionaisRepository.findAll().collectList().block().size();
        profissionais.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, profissionais.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchProfissionais() throws Exception {
        int databaseSizeBeforeUpdate = profissionaisRepository.findAll().collectList().block().size();
        profissionais.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamProfissionais() throws Exception {
        int databaseSizeBeforeUpdate = profissionaisRepository.findAll().collectList().block().size();
        profissionais.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(profissionais))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Profissionais in the database
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteProfissionais() {
        // Initialize the database
        profissionaisRepository.save(profissionais).block();

        int databaseSizeBeforeDelete = profissionaisRepository.findAll().collectList().block().size();

        // Delete the profissionais
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, profissionais.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Profissionais> profissionaisList = profissionaisRepository.findAll().collectList().block();
        assertThat(profissionaisList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
