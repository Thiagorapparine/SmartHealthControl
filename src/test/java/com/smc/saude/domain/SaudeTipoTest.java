package com.smc.saude.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.smc.saude.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SaudeTipoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SaudeTipo.class);
        SaudeTipo saudeTipo1 = new SaudeTipo();
        saudeTipo1.setId("id1");
        SaudeTipo saudeTipo2 = new SaudeTipo();
        saudeTipo2.setId(saudeTipo1.getId());
        assertThat(saudeTipo1).isEqualTo(saudeTipo2);
        saudeTipo2.setId("id2");
        assertThat(saudeTipo1).isNotEqualTo(saudeTipo2);
        saudeTipo1.setId(null);
        assertThat(saudeTipo1).isNotEqualTo(saudeTipo2);
    }
}
