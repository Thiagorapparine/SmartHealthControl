package com.smc.saude.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.smc.saude.IntegrationTest;
import com.smc.saude.domain.UsuariosSaude;
import com.smc.saude.repository.UsuariosSaudeRepository;
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
 * Integration tests for the {@link UsuariosSaudeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class UsuariosSaudeResourceIT {

    private static final byte[] DEFAULT_USUARIO_FOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_USUARIO_FOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_USUARIO_FOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_USUARIO_FOTO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_USUARIO_NOME = "AAAAAAAAAA";
    private static final String UPDATED_USUARIO_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_USUARIO_CPF = "804.03636645";
    private static final String UPDATED_USUARIO_CPF = "935669.515-33";

    private static final String DEFAULT_USUARIO_DATA_NASCIMENTO = "91|06-7721";
    private static final String UPDATED_USUARIO_DATA_NASCIMENTO = "04|64|0780";

    private static final String ENTITY_API_URL = "/api/usuarios-saudes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private UsuariosSaudeRepository usuariosSaudeRepository;

    @Autowired
    private WebTestClient webTestClient;

    private UsuariosSaude usuariosSaude;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UsuariosSaude createEntity() {
        UsuariosSaude usuariosSaude = new UsuariosSaude()
            .usuarioFoto(DEFAULT_USUARIO_FOTO)
            .usuarioFotoContentType(DEFAULT_USUARIO_FOTO_CONTENT_TYPE)
            .usuarioNome(DEFAULT_USUARIO_NOME)
            .usuarioCPF(DEFAULT_USUARIO_CPF)
            .usuarioDataNascimento(DEFAULT_USUARIO_DATA_NASCIMENTO);
        return usuariosSaude;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UsuariosSaude createUpdatedEntity() {
        UsuariosSaude usuariosSaude = new UsuariosSaude()
            .usuarioFoto(UPDATED_USUARIO_FOTO)
            .usuarioFotoContentType(UPDATED_USUARIO_FOTO_CONTENT_TYPE)
            .usuarioNome(UPDATED_USUARIO_NOME)
            .usuarioCPF(UPDATED_USUARIO_CPF)
            .usuarioDataNascimento(UPDATED_USUARIO_DATA_NASCIMENTO);
        return usuariosSaude;
    }

    @BeforeEach
    public void initTest() {
        usuariosSaudeRepository.deleteAll().block();
        usuariosSaude = createEntity();
    }

    @Test
    void createUsuariosSaude() throws Exception {
        int databaseSizeBeforeCreate = usuariosSaudeRepository.findAll().collectList().block().size();
        // Create the UsuariosSaude
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeCreate + 1);
        UsuariosSaude testUsuariosSaude = usuariosSaudeList.get(usuariosSaudeList.size() - 1);
        assertThat(testUsuariosSaude.getUsuarioFoto()).isEqualTo(DEFAULT_USUARIO_FOTO);
        assertThat(testUsuariosSaude.getUsuarioFotoContentType()).isEqualTo(DEFAULT_USUARIO_FOTO_CONTENT_TYPE);
        assertThat(testUsuariosSaude.getUsuarioNome()).isEqualTo(DEFAULT_USUARIO_NOME);
        assertThat(testUsuariosSaude.getUsuarioCPF()).isEqualTo(DEFAULT_USUARIO_CPF);
        assertThat(testUsuariosSaude.getUsuarioDataNascimento()).isEqualTo(DEFAULT_USUARIO_DATA_NASCIMENTO);
    }

    @Test
    void createUsuariosSaudeWithExistingId() throws Exception {
        // Create the UsuariosSaude with an existing ID
        usuariosSaude.setId("existing_id");

        int databaseSizeBeforeCreate = usuariosSaudeRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkUsuarioNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = usuariosSaudeRepository.findAll().collectList().block().size();
        // set the field null
        usuariosSaude.setUsuarioNome(null);

        // Create the UsuariosSaude, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkUsuarioCPFIsRequired() throws Exception {
        int databaseSizeBeforeTest = usuariosSaudeRepository.findAll().collectList().block().size();
        // set the field null
        usuariosSaude.setUsuarioCPF(null);

        // Create the UsuariosSaude, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkUsuarioDataNascimentoIsRequired() throws Exception {
        int databaseSizeBeforeTest = usuariosSaudeRepository.findAll().collectList().block().size();
        // set the field null
        usuariosSaude.setUsuarioDataNascimento(null);

        // Create the UsuariosSaude, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllUsuariosSaudesAsStream() {
        // Initialize the database
        usuariosSaudeRepository.save(usuariosSaude).block();

        List<UsuariosSaude> usuariosSaudeList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(UsuariosSaude.class)
            .getResponseBody()
            .filter(usuariosSaude::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(usuariosSaudeList).isNotNull();
        assertThat(usuariosSaudeList).hasSize(1);
        UsuariosSaude testUsuariosSaude = usuariosSaudeList.get(0);
        assertThat(testUsuariosSaude.getUsuarioFoto()).isEqualTo(DEFAULT_USUARIO_FOTO);
        assertThat(testUsuariosSaude.getUsuarioFotoContentType()).isEqualTo(DEFAULT_USUARIO_FOTO_CONTENT_TYPE);
        assertThat(testUsuariosSaude.getUsuarioNome()).isEqualTo(DEFAULT_USUARIO_NOME);
        assertThat(testUsuariosSaude.getUsuarioCPF()).isEqualTo(DEFAULT_USUARIO_CPF);
        assertThat(testUsuariosSaude.getUsuarioDataNascimento()).isEqualTo(DEFAULT_USUARIO_DATA_NASCIMENTO);
    }

    @Test
    void getAllUsuariosSaudes() {
        // Initialize the database
        usuariosSaudeRepository.save(usuariosSaude).block();

        // Get all the usuariosSaudeList
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
            .value(hasItem(usuariosSaude.getId()))
            .jsonPath("$.[*].usuarioFotoContentType")
            .value(hasItem(DEFAULT_USUARIO_FOTO_CONTENT_TYPE))
            .jsonPath("$.[*].usuarioFoto")
            .value(hasItem(Base64Utils.encodeToString(DEFAULT_USUARIO_FOTO)))
            .jsonPath("$.[*].usuarioNome")
            .value(hasItem(DEFAULT_USUARIO_NOME))
            .jsonPath("$.[*].usuarioCPF")
            .value(hasItem(DEFAULT_USUARIO_CPF))
            .jsonPath("$.[*].usuarioDataNascimento")
            .value(hasItem(DEFAULT_USUARIO_DATA_NASCIMENTO));
    }

    @Test
    void getUsuariosSaude() {
        // Initialize the database
        usuariosSaudeRepository.save(usuariosSaude).block();

        // Get the usuariosSaude
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, usuariosSaude.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(usuariosSaude.getId()))
            .jsonPath("$.usuarioFotoContentType")
            .value(is(DEFAULT_USUARIO_FOTO_CONTENT_TYPE))
            .jsonPath("$.usuarioFoto")
            .value(is(Base64Utils.encodeToString(DEFAULT_USUARIO_FOTO)))
            .jsonPath("$.usuarioNome")
            .value(is(DEFAULT_USUARIO_NOME))
            .jsonPath("$.usuarioCPF")
            .value(is(DEFAULT_USUARIO_CPF))
            .jsonPath("$.usuarioDataNascimento")
            .value(is(DEFAULT_USUARIO_DATA_NASCIMENTO));
    }

    @Test
    void getNonExistingUsuariosSaude() {
        // Get the usuariosSaude
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewUsuariosSaude() throws Exception {
        // Initialize the database
        usuariosSaudeRepository.save(usuariosSaude).block();

        int databaseSizeBeforeUpdate = usuariosSaudeRepository.findAll().collectList().block().size();

        // Update the usuariosSaude
        UsuariosSaude updatedUsuariosSaude = usuariosSaudeRepository.findById(usuariosSaude.getId()).block();
        updatedUsuariosSaude
            .usuarioFoto(UPDATED_USUARIO_FOTO)
            .usuarioFotoContentType(UPDATED_USUARIO_FOTO_CONTENT_TYPE)
            .usuarioNome(UPDATED_USUARIO_NOME)
            .usuarioCPF(UPDATED_USUARIO_CPF)
            .usuarioDataNascimento(UPDATED_USUARIO_DATA_NASCIMENTO);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedUsuariosSaude.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedUsuariosSaude))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeUpdate);
        UsuariosSaude testUsuariosSaude = usuariosSaudeList.get(usuariosSaudeList.size() - 1);
        assertThat(testUsuariosSaude.getUsuarioFoto()).isEqualTo(UPDATED_USUARIO_FOTO);
        assertThat(testUsuariosSaude.getUsuarioFotoContentType()).isEqualTo(UPDATED_USUARIO_FOTO_CONTENT_TYPE);
        assertThat(testUsuariosSaude.getUsuarioNome()).isEqualTo(UPDATED_USUARIO_NOME);
        assertThat(testUsuariosSaude.getUsuarioCPF()).isEqualTo(UPDATED_USUARIO_CPF);
        assertThat(testUsuariosSaude.getUsuarioDataNascimento()).isEqualTo(UPDATED_USUARIO_DATA_NASCIMENTO);
    }

    @Test
    void putNonExistingUsuariosSaude() throws Exception {
        int databaseSizeBeforeUpdate = usuariosSaudeRepository.findAll().collectList().block().size();
        usuariosSaude.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, usuariosSaude.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchUsuariosSaude() throws Exception {
        int databaseSizeBeforeUpdate = usuariosSaudeRepository.findAll().collectList().block().size();
        usuariosSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamUsuariosSaude() throws Exception {
        int databaseSizeBeforeUpdate = usuariosSaudeRepository.findAll().collectList().block().size();
        usuariosSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateUsuariosSaudeWithPatch() throws Exception {
        // Initialize the database
        usuariosSaudeRepository.save(usuariosSaude).block();

        int databaseSizeBeforeUpdate = usuariosSaudeRepository.findAll().collectList().block().size();

        // Update the usuariosSaude using partial update
        UsuariosSaude partialUpdatedUsuariosSaude = new UsuariosSaude();
        partialUpdatedUsuariosSaude.setId(usuariosSaude.getId());

        partialUpdatedUsuariosSaude
            .usuarioNome(UPDATED_USUARIO_NOME)
            .usuarioCPF(UPDATED_USUARIO_CPF)
            .usuarioDataNascimento(UPDATED_USUARIO_DATA_NASCIMENTO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedUsuariosSaude.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedUsuariosSaude))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeUpdate);
        UsuariosSaude testUsuariosSaude = usuariosSaudeList.get(usuariosSaudeList.size() - 1);
        assertThat(testUsuariosSaude.getUsuarioFoto()).isEqualTo(DEFAULT_USUARIO_FOTO);
        assertThat(testUsuariosSaude.getUsuarioFotoContentType()).isEqualTo(DEFAULT_USUARIO_FOTO_CONTENT_TYPE);
        assertThat(testUsuariosSaude.getUsuarioNome()).isEqualTo(UPDATED_USUARIO_NOME);
        assertThat(testUsuariosSaude.getUsuarioCPF()).isEqualTo(UPDATED_USUARIO_CPF);
        assertThat(testUsuariosSaude.getUsuarioDataNascimento()).isEqualTo(UPDATED_USUARIO_DATA_NASCIMENTO);
    }

    @Test
    void fullUpdateUsuariosSaudeWithPatch() throws Exception {
        // Initialize the database
        usuariosSaudeRepository.save(usuariosSaude).block();

        int databaseSizeBeforeUpdate = usuariosSaudeRepository.findAll().collectList().block().size();

        // Update the usuariosSaude using partial update
        UsuariosSaude partialUpdatedUsuariosSaude = new UsuariosSaude();
        partialUpdatedUsuariosSaude.setId(usuariosSaude.getId());

        partialUpdatedUsuariosSaude
            .usuarioFoto(UPDATED_USUARIO_FOTO)
            .usuarioFotoContentType(UPDATED_USUARIO_FOTO_CONTENT_TYPE)
            .usuarioNome(UPDATED_USUARIO_NOME)
            .usuarioCPF(UPDATED_USUARIO_CPF)
            .usuarioDataNascimento(UPDATED_USUARIO_DATA_NASCIMENTO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedUsuariosSaude.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedUsuariosSaude))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeUpdate);
        UsuariosSaude testUsuariosSaude = usuariosSaudeList.get(usuariosSaudeList.size() - 1);
        assertThat(testUsuariosSaude.getUsuarioFoto()).isEqualTo(UPDATED_USUARIO_FOTO);
        assertThat(testUsuariosSaude.getUsuarioFotoContentType()).isEqualTo(UPDATED_USUARIO_FOTO_CONTENT_TYPE);
        assertThat(testUsuariosSaude.getUsuarioNome()).isEqualTo(UPDATED_USUARIO_NOME);
        assertThat(testUsuariosSaude.getUsuarioCPF()).isEqualTo(UPDATED_USUARIO_CPF);
        assertThat(testUsuariosSaude.getUsuarioDataNascimento()).isEqualTo(UPDATED_USUARIO_DATA_NASCIMENTO);
    }

    @Test
    void patchNonExistingUsuariosSaude() throws Exception {
        int databaseSizeBeforeUpdate = usuariosSaudeRepository.findAll().collectList().block().size();
        usuariosSaude.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, usuariosSaude.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchUsuariosSaude() throws Exception {
        int databaseSizeBeforeUpdate = usuariosSaudeRepository.findAll().collectList().block().size();
        usuariosSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamUsuariosSaude() throws Exception {
        int databaseSizeBeforeUpdate = usuariosSaudeRepository.findAll().collectList().block().size();
        usuariosSaude.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuariosSaude))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the UsuariosSaude in the database
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteUsuariosSaude() {
        // Initialize the database
        usuariosSaudeRepository.save(usuariosSaude).block();

        int databaseSizeBeforeDelete = usuariosSaudeRepository.findAll().collectList().block().size();

        // Delete the usuariosSaude
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, usuariosSaude.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<UsuariosSaude> usuariosSaudeList = usuariosSaudeRepository.findAll().collectList().block();
        assertThat(usuariosSaudeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
