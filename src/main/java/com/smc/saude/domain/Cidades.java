package com.smc.saude.domain;

import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Cidades.
 */
@Document(collection = "cidades")
public class Cidades implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("cidade_nome")
    private String cidadeNome;

    @DBRef
    @Field("estados")
    private Estados estados;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Cidades id(String id) {
        this.id = id;
        return this;
    }

    public String getCidadeNome() {
        return this.cidadeNome;
    }

    public Cidades cidadeNome(String cidadeNome) {
        this.cidadeNome = cidadeNome;
        return this;
    }

    public void setCidadeNome(String cidadeNome) {
        this.cidadeNome = cidadeNome;
    }

    public Estados getEstados() {
        return this.estados;
    }

    public Cidades estados(Estados estados) {
        this.setEstados(estados);
        return this;
    }

    public void setEstados(Estados estados) {
        this.estados = estados;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cidades)) {
            return false;
        }
        return id != null && id.equals(((Cidades) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cidades{" +
            "id=" + getId() +
            ", cidadeNome='" + getCidadeNome() + "'" +
            "}";
    }
}
