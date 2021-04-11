package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.ConsultasAgenda;
import com.smc.saude.repository.ConsultasAgendaRepository;
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
 * Integration tests for the {@link ConsultasAgendaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class ConsultasAgendaResourceIT {

    private static final Instant DEFAULT_AGENDAMENTO_DATA = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_AGENDAMENTO_DATA = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/consultas-agenda";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ConsultasAgendaRepository consultasAgendaRepository;

    @Autowired
    private WebTestClient webTestClient;

    private ConsultasAgenda consultasAgenda;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ConsultasAgenda createEntity() {
        ConsultasAgenda consultasAgenda = new ConsultasAgenda().agendamentoData(DEFAULT_AGENDAMENTO_DATA);
        return consultasAgenda;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ConsultasAgenda createUpdatedEntity() {
        ConsultasAgenda consultasAgenda = new ConsultasAgenda().agendamentoData(UPDATED_AGENDAMENTO_DATA);
        return consultasAgenda;
    }

    @BeforeEach
    public void initTest() {
        consultasAgendaRepository.deleteAll().block();
        consultasAgenda = createEntity();
    }

    @Test
    void createConsultasAgenda() throws Exception {
        int databaseSizeBeforeCreate = consultasAgendaRepository.findAll().collectList().block().size();
        // Create the ConsultasAgenda
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(consultasAgenda))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeCreate + 1);
        ConsultasAgenda testConsultasAgenda = consultasAgendaList.get(consultasAgendaList.size() - 1);
        assertThat(testConsultasAgenda.getAgendamentoData()).isEqualTo(DEFAULT_AGENDAMENTO_DATA);
    }

    @Test
    void createConsultasAgendaWithExistingId() throws Exception {
        // Create the ConsultasAgenda with an existing ID
        consultasAgenda.setId("existing_id");

        int databaseSizeBeforeCreate = consultasAgendaRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(consultasAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkAgendamentoDataIsRequired() throws Exception {
        int databaseSizeBeforeTest = consultasAgendaRepository.findAll().collectList().block().size();
        // set the field null
        consultasAgenda.setAgendamentoData(null);

        // Create the ConsultasAgenda, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(consultasAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllConsultasAgenda() {
        // Initialize the database
        consultasAgendaRepository.save(consultasAgenda).block();

        // Get all the consultasAgendaList
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
            .value(hasItem(consultasAgenda.getId()))
            .jsonPath("$.[*].agendamentoData")
            .value(hasItem(DEFAULT_AGENDAMENTO_DATA.toString()));
    }

    @Test
    void getConsultasAgenda() {
        // Initialize the database
        consultasAgendaRepository.save(consultasAgenda).block();

        // Get the consultasAgenda
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, consultasAgenda.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(consultasAgenda.getId()))
            .jsonPath("$.agendamentoData")
            .value(is(DEFAULT_AGENDAMENTO_DATA.toString()));
    }

    @Test
    void getNonExistingConsultasAgenda() {
        // Get the consultasAgenda
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewConsultasAgenda() throws Exception {
        // Initialize the database
        consultasAgendaRepository.save(consultasAgenda).block();

        int databaseSizeBeforeUpdate = consultasAgendaRepository.findAll().collectList().block().size();

        // Update the consultasAgenda
        ConsultasAgenda updatedConsultasAgenda = consultasAgendaRepository.findById(consultasAgenda.getId()).block();
        updatedConsultasAgenda.agendamentoData(UPDATED_AGENDAMENTO_DATA);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedConsultasAgenda.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedConsultasAgenda))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeUpdate);
        ConsultasAgenda testConsultasAgenda = consultasAgendaList.get(consultasAgendaList.size() - 1);
        assertThat(testConsultasAgenda.getAgendamentoData()).isEqualTo(UPDATED_AGENDAMENTO_DATA);
    }

    @Test
    void putNonExistingConsultasAgenda() throws Exception {
        int databaseSizeBeforeUpdate = consultasAgendaRepository.findAll().collectList().block().size();
        consultasAgenda.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, consultasAgenda.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(consultasAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchConsultasAgenda() throws Exception {
        int databaseSizeBeforeUpdate = consultasAgendaRepository.findAll().collectList().block().size();
        consultasAgenda.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(consultasAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamConsultasAgenda() throws Exception {
        int databaseSizeBeforeUpdate = consultasAgendaRepository.findAll().collectList().block().size();
        consultasAgenda.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(consultasAgenda))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateConsultasAgendaWithPatch() throws Exception {
        // Initialize the database
        consultasAgendaRepository.save(consultasAgenda).block();

        int databaseSizeBeforeUpdate = consultasAgendaRepository.findAll().collectList().block().size();

        // Update the consultasAgenda using partial update
        ConsultasAgenda partialUpdatedConsultasAgenda = new ConsultasAgenda();
        partialUpdatedConsultasAgenda.setId(consultasAgenda.getId());

        partialUpdatedConsultasAgenda.agendamentoData(UPDATED_AGENDAMENTO_DATA);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedConsultasAgenda.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultasAgenda))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeUpdate);
        ConsultasAgenda testConsultasAgenda = consultasAgendaList.get(consultasAgendaList.size() - 1);
        assertThat(testConsultasAgenda.getAgendamentoData()).isEqualTo(UPDATED_AGENDAMENTO_DATA);
    }

    @Test
    void fullUpdateConsultasAgendaWithPatch() throws Exception {
        // Initialize the database
        consultasAgendaRepository.save(consultasAgenda).block();

        int databaseSizeBeforeUpdate = consultasAgendaRepository.findAll().collectList().block().size();

        // Update the consultasAgenda using partial update
        ConsultasAgenda partialUpdatedConsultasAgenda = new ConsultasAgenda();
        partialUpdatedConsultasAgenda.setId(consultasAgenda.getId());

        partialUpdatedConsultasAgenda.agendamentoData(UPDATED_AGENDAMENTO_DATA);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedConsultasAgenda.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultasAgenda))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeUpdate);
        ConsultasAgenda testConsultasAgenda = consultasAgendaList.get(consultasAgendaList.size() - 1);
        assertThat(testConsultasAgenda.getAgendamentoData()).isEqualTo(UPDATED_AGENDAMENTO_DATA);
    }

    @Test
    void patchNonExistingConsultasAgenda() throws Exception {
        int databaseSizeBeforeUpdate = consultasAgendaRepository.findAll().collectList().block().size();
        consultasAgenda.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, consultasAgenda.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(consultasAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchConsultasAgenda() throws Exception {
        int databaseSizeBeforeUpdate = consultasAgendaRepository.findAll().collectList().block().size();
        consultasAgenda.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(consultasAgenda))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamConsultasAgenda() throws Exception {
        int databaseSizeBeforeUpdate = consultasAgendaRepository.findAll().collectList().block().size();
        consultasAgenda.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(consultasAgenda))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ConsultasAgenda in the database
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteConsultasAgenda() {
        // Initialize the database
        consultasAgendaRepository.save(consultasAgenda).block();

        int databaseSizeBeforeDelete = consultasAgendaRepository.findAll().collectList().block().size();

        // Delete the consultasAgenda
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, consultasAgenda.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<ConsultasAgenda> consultasAgendaList = consultasAgendaRepository.findAll().collectList().block();
        assertThat(consultasAgendaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
