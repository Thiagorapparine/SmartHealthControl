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
 * A ConsultasAgenda.
 */
@Document(collection = "consultas_agenda")
public class ConsultasAgenda implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("agendamento_data")
    private Instant agendamentoData;

    @DBRef
    @Field("usuariosSaude")
    private UsuariosSaude usuariosSaude;

    @DBRef
    @Field("setorSaude")
    private SetorSaude setorSaude;

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

    public ConsultasAgenda id(String id) {
        this.id = id;
        return this;
    }

    public Instant getAgendamentoData() {
        return this.agendamentoData;
    }

    public ConsultasAgenda agendamentoData(Instant agendamentoData) {
        this.agendamentoData = agendamentoData;
        return this;
    }

    public void setAgendamentoData(Instant agendamentoData) {
        this.agendamentoData = agendamentoData;
    }

    public UsuariosSaude getUsuariosSaude() {
        return this.usuariosSaude;
    }

    public ConsultasAgenda usuariosSaude(UsuariosSaude usuariosSaude) {
        this.setUsuariosSaude(usuariosSaude);
        return this;
    }

    public void setUsuariosSaude(UsuariosSaude usuariosSaude) {
        this.usuariosSaude = usuariosSaude;
    }

    public SetorSaude getSetorSaude() {
        return this.setorSaude;
    }

    public ConsultasAgenda setorSaude(SetorSaude setorSaude) {
        this.setSetorSaude(setorSaude);
        return this;
    }

    public void setSetorSaude(SetorSaude setorSaude) {
        this.setorSaude = setorSaude;
    }

    public EntidadeSaude getEntidadeSaude() {
        return this.entidadeSaude;
    }

    public ConsultasAgenda entidadeSaude(EntidadeSaude entidadeSaude) {
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
        if (!(o instanceof ConsultasAgenda)) {
            return false;
        }
        return id != null && id.equals(((ConsultasAgenda) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ConsultasAgenda{" +
            "id=" + getId() +
            ", agendamentoData='" + getAgendamentoData() + "'" +
            "}";
    }
}
