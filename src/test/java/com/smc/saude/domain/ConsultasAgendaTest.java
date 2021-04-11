package com.smc.saude.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.smc.saude.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConsultasAgendaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ConsultasAgenda.class);
        ConsultasAgenda consultasAgenda1 = new ConsultasAgenda();
        consultasAgenda1.setId("id1");
        ConsultasAgenda consultasAgenda2 = new ConsultasAgenda();
        consultasAgenda2.setId(consultasAgenda1.getId());
        assertThat(consultasAgenda1).isEqualTo(consultasAgenda2);
        consultasAgenda2.setId("id2");
        assertThat(consultasAgenda1).isNotEqualTo(consultasAgenda2);
        consultasAgenda1.setId(null);
        assertThat(consultasAgenda1).isNotEqualTo(consultasAgenda2);
    }
}
