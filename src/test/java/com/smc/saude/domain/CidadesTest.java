package com.smc.saude.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.smc.saude.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CidadesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cidades.class);
        Cidades cidades1 = new Cidades();
        cidades1.setId("id1");
        Cidades cidades2 = new Cidades();
        cidades2.setId(cidades1.getId());
        assertThat(cidades1).isEqualTo(cidades2);
        cidades2.setId("id2");
        assertThat(cidades1).isNotEqualTo(cidades2);
        cidades1.setId(null);
        assertThat(cidades1).isNotEqualTo(cidades2);
    }
}
