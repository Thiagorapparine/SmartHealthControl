package com.smc.saude.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.smc.saude.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TiposProcedimentoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TiposProcedimento.class);
        TiposProcedimento tiposProcedimento1 = new TiposProcedimento();
        tiposProcedimento1.setId("id1");
        TiposProcedimento tiposProcedimento2 = new TiposProcedimento();
        tiposProcedimento2.setId(tiposProcedimento1.getId());
        assertThat(tiposProcedimento1).isEqualTo(tiposProcedimento2);
        tiposProcedimento2.setId("id2");
        assertThat(tiposProcedimento1).isNotEqualTo(tiposProcedimento2);
        tiposProcedimento1.setId(null);
        assertThat(tiposProcedimento1).isNotEqualTo(tiposProcedimento2);
    }
}
