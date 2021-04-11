package com.smc.saude.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.smc.saude.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EntidadeSaudeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EntidadeSaude.class);
        EntidadeSaude entidadeSaude1 = new EntidadeSaude();
        entidadeSaude1.setId("id1");
        EntidadeSaude entidadeSaude2 = new EntidadeSaude();
        entidadeSaude2.setId(entidadeSaude1.getId());
        assertThat(entidadeSaude1).isEqualTo(entidadeSaude2);
        entidadeSaude2.setId("id2");
        assertThat(entidadeSaude1).isNotEqualTo(entidadeSaude2);
        entidadeSaude1.setId(null);
        assertThat(entidadeSaude1).isNotEqualTo(entidadeSaude2);
    }
}
