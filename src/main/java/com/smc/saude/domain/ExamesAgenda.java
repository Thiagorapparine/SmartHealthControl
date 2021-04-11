package com.smc.saude.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A ExamesAgenda.
 */
@Document(collection = "exames_agenda")
public class ExamesAgenda implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("agendamento_data")
    private Instant agendamentoData;

    @DBRef
    @Field("tiposProcedimento")
    private TiposProcedimento tiposProcedimento;

    @DBRef
    @Field("entidadeSaude")
    private EntidadeSaude entidadeSaude;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ExamesAgenda id(String id) {
        this.id = id;
        return this;
    }

    public Instant getAgendamentoData() {
        return this.agendamentoData;
    }

    public ExamesAgenda agendamentoData(Instant agendamentoData) {
        this.agendamentoData = agendamentoData;
        return this;
    }

    public void setAgendamentoData(Instant agendamentoData) {
        this.agendamentoData = agendamentoData;
    }

    public TiposProcedimento getTiposProcedimento() {
        return this.tiposProcedimento;
    }

    public ExamesAgenda tiposProcedimento(TiposProcedimento tiposProcedimento) {
        this.setTiposProcedimento(tiposProcedimento);
        return this;
    }

    public void setTiposProcedimento(TiposProcedimento tiposProcedimento) {
        this.tiposProcedimento = tiposProcedimento;
    }

    public EntidadeSaude getEntidadeSaude() {
        return this.entidadeSaude;
    }

    public ExamesAgenda entidadeSaude(EntidadeSaude entidadeSaude) {
        this.setEntidadeSaude(entidadeSaude);
        return this;
    }

    public void setEntidadeSaude(EntidadeSaude entidadeSaude) {
        this.entidadeSaude = entidadeSaude;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExamesAgenda)) {
            return false;
        }
        return id != null && id.equals(((ExamesAgenda) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExamesAgenda{" +
            "id=" + getId() +
            ", agendamentoData='" + getAgendamentoData() + "'" +
            "}";
    }
}
