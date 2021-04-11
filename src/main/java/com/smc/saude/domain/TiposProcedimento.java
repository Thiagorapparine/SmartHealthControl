package com.smc.saude.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A TiposProcedimento.
 */
@Document(collection = "tipos_procedimento")
public class TiposProcedimento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("procedimento_nome")
    private String procedimentoNome;

    @Field("procedimento_descricao")
    private String procedimentoDescricao;

    @DBRef
    @Field("setorSaude")
    private SetorSaude setorSaude;

    @DBRef
    @Field("entidadeNomes")
    @JsonIgnoreProperties(value = { "saudeTipo", "estados", "cidades", "tiposProcedimentos", "profissionais" }, allowSetters = true)
    private Set<EntidadeSaude> entidadeNomes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public TiposProcedimento id(String id) {
        this.id = id;
        return this;
    }

    public String getProcedimentoNome() {
        return this.procedimentoNome;
    }

    public TiposProcedimento procedimentoNome(String procedimentoNome) {
        this.procedimentoNome = procedimentoNome;
        return this;
    }

    public void setProcedimentoNome(String procedimentoNome) {
        this.procedimentoNome = procedimentoNome;
    }

    public String getProcedimentoDescricao() {
        return this.procedimentoDescricao;
    }

    public TiposProcedimento procedimentoDescricao(String procedimentoDescricao) {
        this.procedimentoDescricao = procedimentoDescricao;
        return this;
    }

    public void setProcedimentoDescricao(String procedimentoDescricao) {
        this.procedimentoDescricao = procedimentoDescricao;
    }

    public SetorSaude getSetorSaude() {
        return this.setorSaude;
    }

    public TiposProcedimento setorSaude(SetorSaude setorSaude) {
        this.setSetorSaude(setorSaude);
        return this;
    }

    public void setSetorSaude(SetorSaude setorSaude) {
        this.setorSaude = setorSaude;
    }

    public Set<EntidadeSaude> getEntidadeNomes() {
        return this.entidadeNomes;
    }

    public TiposProcedimento entidadeNomes(Set<EntidadeSaude> entidadeSaudes) {
        this.setEntidadeNomes(entidadeSaudes);
        return this;
    }

    public TiposProcedimento addEntidadeNome(EntidadeSaude entidadeSaude) {
        this.entidadeNomes.add(entidadeSaude);
        entidadeSaude.getTiposProcedimentos().add(this);
        return this;
    }

    public TiposProcedimento removeEntidadeNome(EntidadeSaude entidadeSaude) {
        this.entidadeNomes.remove(entidadeSaude);
        entidadeSaude.getTiposProcedimentos().remove(this);
        return this;
    }

    public void setEntidadeNomes(Set<EntidadeSaude> entidadeSaudes) {
        if (this.entidadeNomes != null) {
            this.entidadeNomes.forEach(i -> i.removeTiposProcedimento(this));
        }
        if (entidadeSaudes != null) {
            entidadeSaudes.forEach(i -> i.addTiposProcedimento(this));
        }
        this.entidadeNomes = entidadeSaudes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TiposProcedimento)) {
            return false;
        }
        return id != null && id.equals(((TiposProcedimento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TiposProcedimento{" +
            "id=" + getId() +
            ", procedimentoNome='" + getProcedimentoNome() + "'" +
            ", procedimentoDescricao='" + getProcedimentoDescricao() + "'" +
            "}";
    }
}
