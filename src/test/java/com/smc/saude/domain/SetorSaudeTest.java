package com.smc.saude.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.smc.saude.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SetorSaudeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SetorSaude.class);
        SetorSaude setorSaude1 = new SetorSaude();
        setorSaude1.setId("id1");
        SetorSaude setorSaude2 = new SetorSaude();
        setorSaude2.setId(setorSaude1.getId());
        assertThat(setorSaude1).isEqualTo(setorSaude2);
        setorSaude2.setId("id2");
        assertThat(setorSaude1).isNotEqualTo(setorSaude2);
        setorSaude1.setId(null);
        assertThat(setorSaude1).isNotEqualTo(setorSaude2);
    }
}
