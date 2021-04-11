package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.SetorSaude;
import com.smc.saude.repository.SetorSaudeRepository;
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
 * Integration tests for the {@link SetorSaudeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class SetorSaudeResourceIT {

    private static final String DEFAULT_SETOR_SAUDE = "AAAAAAAAAA";
    private static final String UPDATED_SETOR_SAUDE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/setor-saudes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SetorSaudeRepository setorSaudeRepository;

    @Autowired
    private WebTestClient webTestClient;

    private SetorSaude setorSaude;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SetorSaude createEntity() {
        SetorSaude setorSaude = new SetorSaude().setorSaude(DEFAULT_SETOR_SAUDE);
        return setorSaude;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SetorSaude createUpdatedEntity() {
        SetorSaude setorSaude = new SetorSaude().setorSaude(UPDATED_SETOR_SAUDE);
        return setorSaude;
    }

    @BeforeEach
    public void initTest() {
        setorSaudeRepository.deleteAll().block();
        setorSaude = createEntity();
    }

    @Test
    void createSetorSaude() throws Exception {
        int databaseSizeBeforeCreate = setorSaudeRepository.findAll().collectList().block().size();
        // Create the SetorSaude
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorSaude))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeCreate + 1);
        SetorSaude testSetorSaude = setorSaudeList.get(setorSaudeList.size() - 1);
        assertThat(testSetorSaude.getSetorSaude()).isEqualTo(DEFAULT_SETOR_SAUDE);
    }

    @Test
    void createSetorSaudeWithExistingId() throws Exception {
        // Create the SetorSaude with an existing ID
        setorSaude.setId("existing_id");

        int databaseSizeBeforeCreate = setorSaudeRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkSetorSaudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = setorSaudeRepository.findAll().collectList().block().size();
        // set the field null
        setorSaude.setSetorSaude(null);

        // Create the SetorSaude, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllSetorSaudesAsStream() {
        // Initialize the database
        setorSaudeRepository.save(setorSaude).block();

        List<SetorSaude> setorSaudeList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(SetorSaude.class)
            .getResponseBody()
            .filter(setorSaude::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(setorSaudeList).isNotNull();
        assertThat(setorSaudeList).hasSize(1);
        SetorSaude testSetorSaude = setorSaudeList.get(0);
        assertThat(testSetorSaude.getSetorSaude()).isEqualTo(DEFAULT_SETOR_SAUDE);
    }

    @Test
    void getAllSetorSaudes() {
        // Initialize the database
        setorSaudeRepository.save(setorSaude).block();

        // Get all the setorSaudeList
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
            .value(hasItem(setorSaude.getId()))
            .jsonPath("$.[*].setorSaude")
            .value(hasItem(DEFAULT_SETOR_SAUDE));
    }

    @Test
    void getSetorSaude() {
        // Initialize the database
        setorSaudeRepository.save(setorSaude).block();

        // Get the setorSaude
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, setorSaude.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(setorSaude.getId()))
            .jsonPath("$.setorSaude")
            .value(is(DEFAULT_SETOR_SAUDE));
    }

    @Test
    void getNonExistingSetorSaude() {
        // Get the setorSaude
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewSetorSaude() throws Exception {
        // Initialize the database
        setorSaudeRepository.save(setorSaude).block();

        int databaseSizeBeforeUpdate = setorSaudeRepository.findAll().collectList().block().size();

        // Update the setorSaude
        SetorSaude updatedSetorSaude = setorSaudeRepository.findById(setorSaude.getId()).block();
        updatedSetorSaude.setorSaude(UPDATED_SETOR_SAUDE);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedSetorSaude.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedSetorSaude))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeUpdate);
        SetorSaude testSetorSaude = setorSaudeList.get(setorSaudeList.size() - 1);
        assertThat(testSetorSaude.getSetorSaude()).isEqualTo(UPDATED_SETOR_SAUDE);
    }

    @Test
    void putNonExistingSetorSaude() throws Exception {
        int databaseSizeBeforeUpdate = setorSaudeRepository.findAll().collectList().block().size();
        setorSaude.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, setorSaude.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSetorSaude() throws Exception {
        int databaseSizeBeforeUpdate = setorSaudeRepository.findAll().collectList().block().size();
        setorSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSetorSaude() throws Exception {
        int databaseSizeBeforeUpdate = setorSaudeRepository.findAll().collectList().block().size();
        setorSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorSaude))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSetorSaudeWithPatch() throws Exception {
        // Initialize the database
        setorSaudeRepository.save(setorSaude).block();

        int databaseSizeBeforeUpdate = setorSaudeRepository.findAll().collectList().block().size();

        // Update the setorSaude using partial update
        SetorSaude partialUpdatedSetorSaude = new SetorSaude();
        partialUpdatedSetorSaude.setId(setorSaude.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSetorSaude.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSetorSaude))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeUpdate);
        SetorSaude testSetorSaude = setorSaudeList.get(setorSaudeList.size() - 1);
        assertThat(testSetorSaude.getSetorSaude()).isEqualTo(DEFAULT_SETOR_SAUDE);
    }

    @Test
    void fullUpdateSetorSaudeWithPatch() throws Exception {
        // Initialize the database
        setorSaudeRepository.save(setorSaude).block();

        int databaseSizeBeforeUpdate = setorSaudeRepository.findAll().collectList().block().size();

        // Update the setorSaude using partial update
        SetorSaude partialUpdatedSetorSaude = new SetorSaude();
        partialUpdatedSetorSaude.setId(setorSaude.getId());

        partialUpdatedSetorSaude.setorSaude(UPDATED_SETOR_SAUDE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSetorSaude.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSetorSaude))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeUpdate);
        SetorSaude testSetorSaude = setorSaudeList.get(setorSaudeList.size() - 1);
        assertThat(testSetorSaude.getSetorSaude()).isEqualTo(UPDATED_SETOR_SAUDE);
    }

    @Test
    void patchNonExistingSetorSaude() throws Exception {
        int databaseSizeBeforeUpdate = setorSaudeRepository.findAll().collectList().block().size();
        setorSaude.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, setorSaude.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSetorSaude() throws Exception {
        int databaseSizeBeforeUpdate = setorSaudeRepository.findAll().collectList().block().size();
        setorSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSetorSaude() throws Exception {
        int databaseSizeBeforeUpdate = setorSaudeRepository.findAll().collectList().block().size();
        setorSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorSaude))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the SetorSaude in the database
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSetorSaude() {
        // Initialize the database
        setorSaudeRepository.save(setorSaude).block();

        int databaseSizeBeforeDelete = setorSaudeRepository.findAll().collectList().block().size();

        // Delete the setorSaude
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, setorSaude.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<SetorSaude> setorSaudeList = setorSaudeRepository.findAll().collectList().block();
        assertThat(setorSaudeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
