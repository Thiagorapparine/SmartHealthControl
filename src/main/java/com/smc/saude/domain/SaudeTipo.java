package com.smc.saude.domain;

import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A SaudeTipo.
 */
@Document(collection = "saude_tipo")
public class SaudeTipo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("tipo_identificacao")
    private String tipoIdentificacao;

    @Field("tipo_descricao")
    private String tipoDescricao;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public SaudeTipo id(String id) {
        this.id = id;
        return this;
    }

    public String getTipoIdentificacao() {
        return this.tipoIdentificacao;
    }

    public SaudeTipo tipoIdentificacao(String tipoIdentificacao) {
        this.tipoIdentificacao = tipoIdentificacao;
        return this;
    }

    public void setTipoIdentificacao(String tipoIdentificacao) {
        this.tipoIdentificacao = tipoIdentificacao;
    }

    public String getTipoDescricao() {
        return this.tipoDescricao;
    }

    public SaudeTipo tipoDescricao(String tipoDescricao) {
        this.tipoDescricao = tipoDescricao;
        return this;
    }

    public void setTipoDescricao(String tipoDescricao) {
        this.tipoDescricao = tipoDescricao;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SaudeTipo)) {
            return false;
        }
        return id != null && id.equals(((SaudeTipo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SaudeTipo{" +
            "id=" + getId() +
            ", tipoIdentificacao='" + getTipoIdentificacao() + "'" +
            ", tipoDescricao='" + getTipoDescricao() + "'" +
            "}";
    }
}
