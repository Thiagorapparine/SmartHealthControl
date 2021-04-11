package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.ExamesAgenda;
import com.smc.saude.repository.ExamesAgendaRepository;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link ExamesAgendaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class ExamesAgendaResourceIT {

    private static final Instant DEFAULT_AGENDAMENTO_DATA = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_AGENDAMENTO_DATA = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/exames-agenda";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ExamesAgendaRepository examesAgendaRepository;

    @Autowired
    private WebTestClient webTestClient;

    private ExamesAgenda examesAgenda;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExamesAgenda createEntity() {
        ExamesAgenda examesAgenda = new ExamesAgenda().agendamentoData(DEFAULT_AGENDAMENTO_DATA);
        return examesAgenda;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExamesAgenda createUpdatedEntity() {
        ExamesAgenda examesAgenda = new ExamesAgenda().agendamentoData(UPDATED_AGENDAMENTO_DATA);
        return examesAgenda;
    }

    @BeforeEach
    public void initTest() {
        examesAgendaRepository.deleteAll().block();
        examesAgenda = createEntity();
    }

    @Test
    void createExamesAgenda() throws Exception {
        int databaseSizeBeforeCreate = examesAgendaRepository.findAll().collectList().block().size();
        // Create the ExamesAgenda
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(examesAgenda))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeCreate + 1);
        ExamesAgenda testExamesAgenda = examesAgendaList.get(examesAgendaList.size() - 1);
        assertThat(testExamesAgenda.getAgendamentoData()).isEqualTo(DEFAULT_AGENDAMENTO_DATA);
    }

    @Test
    void createExamesAgendaWithExistingId() throws Exception {
        // Create the ExamesAgenda with an existing ID
        examesAgenda.setId("existing_id");

        int databaseSizeBeforeCreate = examesAgendaRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(examesAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkAgendamentoDataIsRequired() throws Exception {
        int databaseSizeBeforeTest = examesAgendaRepository.findAll().collectList().block().size();
        // set the field null
        examesAgenda.setAgendamentoData(null);

        // Create the ExamesAgenda, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(examesAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllExamesAgenda() {
        // Initialize the database
        examesAgendaRepository.save(examesAgenda).block();

        // Get all the examesAgendaList
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
            .value(hasItem(examesAgenda.getId()))
            .jsonPath("$.[*].agendamentoData")
            .value(hasItem(DEFAULT_AGENDAMENTO_DATA.toString()));
    }

    @Test
    void getExamesAgenda() {
        // Initialize the database
        examesAgendaRepository.save(examesAgenda).block();

        // Get the examesAgenda
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, examesAgenda.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(examesAgenda.getId()))
            .jsonPath("$.agendamentoData")
            .value(is(DEFAULT_AGENDAMENTO_DATA.toString()));
    }

    @Test
    void getNonExistingExamesAgenda() {
        // Get the examesAgenda
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewExamesAgenda() throws Exception {
        // Initialize the database
        examesAgendaRepository.save(examesAgenda).block();

        int databaseSizeBeforeUpdate = examesAgendaRepository.findAll().collectList().block().size();

        // Update the examesAgenda
        ExamesAgenda updatedExamesAgenda = examesAgendaRepository.findById(examesAgenda.getId()).block();
        updatedExamesAgenda.agendamentoData(UPDATED_AGENDAMENTO_DATA);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedExamesAgenda.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedExamesAgenda))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeUpdate);
        ExamesAgenda testExamesAgenda = examesAgendaList.get(examesAgendaList.size() - 1);
        assertThat(testExamesAgenda.getAgendamentoData()).isEqualTo(UPDATED_AGENDAMENTO_DATA);
    }

    @Test
    void putNonExistingExamesAgenda() throws Exception {
        int databaseSizeBeforeUpdate = examesAgendaRepository.findAll().collectList().block().size();
        examesAgenda.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, examesAgenda.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(examesAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchExamesAgenda() throws Exception {
        int databaseSizeBeforeUpdate = examesAgendaRepository.findAll().collectList().block().size();
        examesAgenda.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(examesAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamExamesAgenda() throws Exception {
        int databaseSizeBeforeUpdate = examesAgendaRepository.findAll().collectList().block().size();
        examesAgenda.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(examesAgenda))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateExamesAgendaWithPatch() throws Exception {
        // Initialize the database
        examesAgendaRepository.save(examesAgenda).block();

        int databaseSizeBeforeUpdate = examesAgendaRepository.findAll().collectList().block().size();

        // Update the examesAgenda using partial update
        ExamesAgenda partialUpdatedExamesAgenda = new ExamesAgenda();
        partialUpdatedExamesAgenda.setId(examesAgenda.getId());

        partialUpdatedExamesAgenda.agendamentoData(UPDATED_AGENDAMENTO_DATA);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedExamesAgenda.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedExamesAgenda))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeUpdate);
        ExamesAgenda testExamesAgenda = examesAgendaList.get(examesAgendaList.size() - 1);
        assertThat(testExamesAgenda.getAgendamentoData()).isEqualTo(UPDATED_AGENDAMENTO_DATA);
    }

    @Test
    void fullUpdateExamesAgendaWithPatch() throws Exception {
        // Initialize the database
        examesAgendaRepository.save(examesAgenda).block();

        int databaseSizeBeforeUpdate = examesAgendaRepository.findAll().collectList().block().size();

        // Update the examesAgenda using partial update
        ExamesAgenda partialUpdatedExamesAgenda = new ExamesAgenda();
        partialUpdatedExamesAgenda.setId(examesAgenda.getId());

        partialUpdatedExamesAgenda.agendamentoData(UPDATED_AGENDAMENTO_DATA);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedExamesAgenda.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedExamesAgenda))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeUpdate);
        ExamesAgenda testExamesAgenda = examesAgendaList.get(examesAgendaList.size() - 1);
        assertThat(testExamesAgenda.getAgendamentoData()).isEqualTo(UPDATED_AGENDAMENTO_DATA);
    }

    @Test
    void patchNonExistingExamesAgenda() throws Exception {
        int databaseSizeBeforeUpdate = examesAgendaRepository.findAll().collectList().block().size();
        examesAgenda.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, examesAgenda.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(examesAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchExamesAgenda() throws Exception {
        int databaseSizeBeforeUpdate = examesAgendaRepository.findAll().collectList().block().size();
        examesAgenda.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(examesAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamExamesAgenda() throws Exception {
        int databaseSizeBeforeUpdate = examesAgendaRepository.findAll().collectList().block().size();
        examesAgenda.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(examesAgenda))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ExamesAgenda in the database
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteExamesAgenda() {
        // Initialize the database
        examesAgendaRepository.save(examesAgenda).block();

        int databaseSizeBeforeDelete = examesAgendaRepository.findAll().collectList().block().size();

        // Delete the examesAgenda
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, examesAgenda.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<ExamesAgenda> examesAgendaList = examesAgendaRepository.findAll().collectList().block();
        assertThat(examesAgendaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
