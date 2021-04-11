package com.smc.saude.domain;

import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Estados.
 */
@Document(collection = "estados")
public class Estados implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("estados_nome")
    private String estadosNome;

    @NotNull(message = "must not be null")
    @Field("estados_sigla")
    private String estadosSigla;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Estados id(String id) {
        this.id = id;
        return this;
    }

    public String getEstadosNome() {
        return this.estadosNome;
    }

    public Estados estadosNome(String estadosNome) {
        this.estadosNome = estadosNome;
        return this;
    }

    public void setEstadosNome(String estadosNome) {
        this.estadosNome = estadosNome;
    }

    public String getEstadosSigla() {
        return this.estadosSigla;
    }

    public Estados estadosSigla(String estadosSigla) {
        this.estadosSigla = estadosSigla;
        return this;
    }

    public void setEstadosSigla(String estadosSigla) {
        this.estadosSigla = estadosSigla;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Estados)) {
            return false;
        }
        return id != null && id.equals(((Estados) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Estados{" +
            "id=" + getId() +
            ", estadosNome='" + getEstadosNome() + "'" +
            ", estadosSigla='" + getEstadosSigla() + "'" +
            "}";
    }
}
