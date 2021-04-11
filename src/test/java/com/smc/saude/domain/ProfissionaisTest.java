package com.smc.saude.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.smc.saude.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProfissionaisTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Profissionais.class);
        Profissionais profissionais1 = new Profissionais();
        profissionais1.setId("id1");
        Profissionais profissionais2 = new Profissionais();
        profissionais2.setId(profissionais1.getId());
        assertThat(profissionais1).isEqualTo(profissionais2);
        profissionais2.setId("id2");
        assertThat(profissionais1).isNotEqualTo(profissionais2);
        profissionais1.setId(null);
        assertThat(profissionais1).isNotEqualTo(profissionais2);
    }
}
