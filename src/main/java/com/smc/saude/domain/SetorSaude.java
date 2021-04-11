package com.smc.saude.domain;

import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A SetorSaude.
 */
@Document(collection = "setor_saude")
public class SetorSaude implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("setor_saude")
    private String setorSaude;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public SetorSaude id(String id) {
        this.id = id;
        return this;
    }

    public String getSetorSaude() {
        return this.setorSaude;
    }

    public SetorSaude setorSaude(String setorSaude) {
        this.setorSaude = setorSaude;
        return this;
    }

    public void setSetorSaude(String setorSaude) {
        this.setorSaude = setorSaude;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SetorSaude)) {
            return false;
        }
        return id != null && id.equals(((SetorSaude) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SetorSaude{" +
            "id=" + getId() +
            ", setorSaude='" + getSetorSaude() + "'" +
            "}";
    }
}
