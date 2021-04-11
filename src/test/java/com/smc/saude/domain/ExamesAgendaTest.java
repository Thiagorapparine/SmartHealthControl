package com.smc.saude.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.smc.saude.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExamesAgendaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExamesAgenda.class);
        ExamesAgenda examesAgenda1 = new ExamesAgenda();
        examesAgenda1.setId("id1");
        ExamesAgenda examesAgenda2 = new ExamesAgenda();
        examesAgenda2.setId(examesAgenda1.getId());
        assertThat(examesAgenda1).isEqualTo(examesAgenda2);
        examesAgenda2.setId("id2");
        assertThat(examesAgenda1).isNotEqualTo(examesAgenda2);
        examesAgenda1.setId(null);
        assertThat(examesAgenda1).isNotEqualTo(examesAgenda2);
    }
}
