package com.smc.saude.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.smc.saude.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UsuariosSaudeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UsuariosSaude.class);
        UsuariosSaude usuariosSaude1 = new UsuariosSaude();
        usuariosSaude1.setId("id1");
        UsuariosSaude usuariosSaude2 = new UsuariosSaude();
        usuariosSaude2.setId(usuariosSaude1.getId());
        assertThat(usuariosSaude1).isEqualTo(usuariosSaude2);
        usuariosSaude2.setId("id2");
        assertThat(usuariosSaude1).isNotEqualTo(usuariosSaude2);
        usuariosSaude1.setId(null);
        assertThat(usuariosSaude1).isNotEqualTo(usuariosSaude2);
    }
}
