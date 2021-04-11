package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.EntidadeSaude;
import com.smc.saude.domain.enumeration.SetorEntidade;
import com.smc.saude.repository.EntidadeSaudeRepository;
import com.smc.saude.service.EntidadeSaudeService;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Integration tests for the {@link EntidadeSaudeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient
@WithMockUser
class EntidadeSaudeResourceIT {

    private static final String DEFAULT_ENTIDADE_NOME = "AAAAAAAAAA";
    private static final String UPDATED_ENTIDADE_NOME = "BBBBBBBBBB";

    private static final SetorEntidade DEFAULT_ENTIDADE_SETOR = SetorEntidade.Publica;
    private static final SetorEntidade UPDATED_ENTIDADE_SETOR = SetorEntidade.Privada;

    private static final String DEFAULT_ENTIDADE_ENDERECO = "AAAAAAAAAA";
    private static final String UPDATED_ENTIDADE_ENDERECO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/entidade-saudes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private EntidadeSaudeRepository entidadeSaudeRepository;

    @Mock
    private EntidadeSaudeRepository entidadeSaudeRepositoryMock;

    @Mock
    private EntidadeSaudeService entidadeSaudeServiceMock;

    @Autowired
    private WebTestClient webTestClient;

    private EntidadeSaude entidadeSaude;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntidadeSaude createEntity() {
        EntidadeSaude entidadeSaude = new EntidadeSaude()
            .entidadeNome(DEFAULT_ENTIDADE_NOME)
            .entidadeSetor(DEFAULT_ENTIDADE_SETOR)
            .entidadeEndereco(DEFAULT_ENTIDADE_ENDERECO);
        return entidadeSaude;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntidadeSaude createUpdatedEntity() {
        EntidadeSaude entidadeSaude = new EntidadeSaude()
            .entidadeNome(UPDATED_ENTIDADE_NOME)
            .entidadeSetor(UPDATED_ENTIDADE_SETOR)
            .entidadeEndereco(UPDATED_ENTIDADE_ENDERECO);
        return entidadeSaude;
    }

    @BeforeEach
    public void initTest() {
        entidadeSaudeRepository.deleteAll().block();
        entidadeSaude = createEntity();
    }

    @Test
    void createEntidadeSaude() throws Exception {
        int databaseSizeBeforeCreate = entidadeSaudeRepository.findAll().collectList().block().size();
        // Create the EntidadeSaude
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeCreate + 1);
        EntidadeSaude testEntidadeSaude = entidadeSaudeList.get(entidadeSaudeList.size() - 1);
        assertThat(testEntidadeSaude.getEntidadeNome()).isEqualTo(DEFAULT_ENTIDADE_NOME);
        assertThat(testEntidadeSaude.getEntidadeSetor()).isEqualTo(DEFAULT_ENTIDADE_SETOR);
        assertThat(testEntidadeSaude.getEntidadeEndereco()).isEqualTo(DEFAULT_ENTIDADE_ENDERECO);
    }

    @Test
    void createEntidadeSaudeWithExistingId() throws Exception {
        // Create the EntidadeSaude with an existing ID
        entidadeSaude.setId("existing_id");

        int databaseSizeBeforeCreate = entidadeSaudeRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkEntidadeNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = entidadeSaudeRepository.findAll().collectList().block().size();
        // set the field null
        entidadeSaude.setEntidadeNome(null);

        // Create the EntidadeSaude, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkEntidadeSetorIsRequired() throws Exception {
        int databaseSizeBeforeTest = entidadeSaudeRepository.findAll().collectList().block().size();
        // set the field null
        entidadeSaude.setEntidadeSetor(null);

        // Create the EntidadeSaude, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkEntidadeEnderecoIsRequired() throws Exception {
        int databaseSizeBeforeTest = entidadeSaudeRepository.findAll().collectList().block().size();
        // set the field null
        entidadeSaude.setEntidadeEndereco(null);

        // Create the EntidadeSaude, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllEntidadeSaudesAsStream() {
        // Initialize the database
        entidadeSaudeRepository.save(entidadeSaude).block();

        List<EntidadeSaude> entidadeSaudeList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(EntidadeSaude.class)
            .getResponseBody()
            .filter(entidadeSaude::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(entidadeSaudeList).isNotNull();
        assertThat(entidadeSaudeList).hasSize(1);
        EntidadeSaude testEntidadeSaude = entidadeSaudeList.get(0);
        assertThat(testEntidadeSaude.getEntidadeNome()).isEqualTo(DEFAULT_ENTIDADE_NOME);
        assertThat(testEntidadeSaude.getEntidadeSetor()).isEqualTo(DEFAULT_ENTIDADE_SETOR);
        assertThat(testEntidadeSaude.getEntidadeEndereco()).isEqualTo(DEFAULT_ENTIDADE_ENDERECO);
    }

    @Test
    void getAllEntidadeSaudes() {
        // Initialize the database
        entidadeSaudeRepository.save(entidadeSaude).block();

        // Get all the entidadeSaudeList
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
            .value(hasItem(entidadeSaude.getId()))
            .jsonPath("$.[*].entidadeNome")
            .value(hasItem(DEFAULT_ENTIDADE_NOME))
            .jsonPath("$.[*].entidadeSetor")
            .value(hasItem(DEFAULT_ENTIDADE_SETOR.toString()))
            .jsonPath("$.[*].entidadeEndereco")
            .value(hasItem(DEFAULT_ENTIDADE_ENDERECO));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEntidadeSaudesWithEagerRelationshipsIsEnabled() {
        when(entidadeSaudeServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(entidadeSaudeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEntidadeSaudesWithEagerRelationshipsIsNotEnabled() {
        when(entidadeSaudeServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(entidadeSaudeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getEntidadeSaude() {
        // Initialize the database
        entidadeSaudeRepository.save(entidadeSaude).block();

        // Get the entidadeSaude
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, entidadeSaude.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(entidadeSaude.getId()))
            .jsonPath("$.entidadeNome")
            .value(is(DEFAULT_ENTIDADE_NOME))
            .jsonPath("$.entidadeSetor")
            .value(is(DEFAULT_ENTIDADE_SETOR.toString()))
            .jsonPath("$.entidadeEndereco")
            .value(is(DEFAULT_ENTIDADE_ENDERECO));
    }

    @Test
    void getNonExistingEntidadeSaude() {
        // Get the entidadeSaude
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewEntidadeSaude() throws Exception {
        // Initialize the database
        entidadeSaudeRepository.save(entidadeSaude).block();

        int databaseSizeBeforeUpdate = entidadeSaudeRepository.findAll().collectList().block().size();

        // Update the entidadeSaude
        EntidadeSaude updatedEntidadeSaude = entidadeSaudeRepository.findById(entidadeSaude.getId()).block();
        updatedEntidadeSaude
            .entidadeNome(UPDATED_ENTIDADE_NOME)
            .entidadeSetor(UPDATED_ENTIDADE_SETOR)
            .entidadeEndereco(UPDATED_ENTIDADE_ENDERECO);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedEntidadeSaude.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedEntidadeSaude))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeUpdate);
        EntidadeSaude testEntidadeSaude = entidadeSaudeList.get(entidadeSaudeList.size() - 1);
        assertThat(testEntidadeSaude.getEntidadeNome()).isEqualTo(UPDATED_ENTIDADE_NOME);
        assertThat(testEntidadeSaude.getEntidadeSetor()).isEqualTo(UPDATED_ENTIDADE_SETOR);
        assertThat(testEntidadeSaude.getEntidadeEndereco()).isEqualTo(UPDATED_ENTIDADE_ENDERECO);
    }

    @Test
    void putNonExistingEntidadeSaude() throws Exception {
        int databaseSizeBeforeUpdate = entidadeSaudeRepository.findAll().collectList().block().size();
        entidadeSaude.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, entidadeSaude.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchEntidadeSaude() throws Exception {
        int databaseSizeBeforeUpdate = entidadeSaudeRepository.findAll().collectList().block().size();
        entidadeSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamEntidadeSaude() throws Exception {
        int databaseSizeBeforeUpdate = entidadeSaudeRepository.findAll().collectList().block().size();
        entidadeSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateEntidadeSaudeWithPatch() throws Exception {
        // Initialize the database
        entidadeSaudeRepository.save(entidadeSaude).block();

        int databaseSizeBeforeUpdate = entidadeSaudeRepository.findAll().collectList().block().size();

        // Update the entidadeSaude using partial update
        EntidadeSaude partialUpdatedEntidadeSaude = new EntidadeSaude();
        partialUpdatedEntidadeSaude.setId(entidadeSaude.getId());

        partialUpdatedEntidadeSaude.entidadeNome(UPDATED_ENTIDADE_NOME).entidadeSetor(UPDATED_ENTIDADE_SETOR);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEntidadeSaude.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEntidadeSaude))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeUpdate);
        EntidadeSaude testEntidadeSaude = entidadeSaudeList.get(entidadeSaudeList.size() - 1);
        assertThat(testEntidadeSaude.getEntidadeNome()).isEqualTo(UPDATED_ENTIDADE_NOME);
        assertThat(testEntidadeSaude.getEntidadeSetor()).isEqualTo(UPDATED_ENTIDADE_SETOR);
        assertThat(testEntidadeSaude.getEntidadeEndereco()).isEqualTo(DEFAULT_ENTIDADE_ENDERECO);
    }

    @Test
    void fullUpdateEntidadeSaudeWithPatch() throws Exception {
        // Initialize the database
        entidadeSaudeRepository.save(entidadeSaude).block();

        int databaseSizeBeforeUpdate = entidadeSaudeRepository.findAll().collectList().block().size();

        // Update the entidadeSaude using partial update
        EntidadeSaude partialUpdatedEntidadeSaude = new EntidadeSaude();
        partialUpdatedEntidadeSaude.setId(entidadeSaude.getId());

        partialUpdatedEntidadeSaude
            .entidadeNome(UPDATED_ENTIDADE_NOME)
            .entidadeSetor(UPDATED_ENTIDADE_SETOR)
            .entidadeEndereco(UPDATED_ENTIDADE_ENDERECO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEntidadeSaude.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEntidadeSaude))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeUpdate);
        EntidadeSaude testEntidadeSaude = entidadeSaudeList.get(entidadeSaudeList.size() - 1);
        assertThat(testEntidadeSaude.getEntidadeNome()).isEqualTo(UPDATED_ENTIDADE_NOME);
        assertThat(testEntidadeSaude.getEntidadeSetor()).isEqualTo(UPDATED_ENTIDADE_SETOR);
        assertThat(testEntidadeSaude.getEntidadeEndereco()).isEqualTo(UPDATED_ENTIDADE_ENDERECO);
    }

    @Test
    void patchNonExistingEntidadeSaude() throws Exception {
        int databaseSizeBeforeUpdate = entidadeSaudeRepository.findAll().collectList().block().size();
        entidadeSaude.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, entidadeSaude.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchEntidadeSaude() throws Exception {
        int databaseSizeBeforeUpdate = entidadeSaudeRepository.findAll().collectList().block().size();
        entidadeSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamEntidadeSaude() throws Exception {
        int databaseSizeBeforeUpdate = entidadeSaudeRepository.findAll().collectList().block().size();
        entidadeSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(entidadeSaude))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the EntidadeSaude in the database
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteEntidadeSaude() {
        // Initialize the database
        entidadeSaudeRepository.save(entidadeSaude).block();

        int databaseSizeBeforeDelete = entidadeSaudeRepository.findAll().collectList().block().size();

        // Delete the entidadeSaude
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, entidadeSaude.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<EntidadeSaude> entidadeSaudeList = entidadeSaudeRepository.findAll().collectList().block();
        assertThat(entidadeSaudeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
