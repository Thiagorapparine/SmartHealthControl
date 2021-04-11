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
 * A Profissionais.
 */
@Document(collection = "profissionais")
public class Profissionais implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("profissional_nome")
    private String profissionalNome;

    @NotNull(message = "must not be null")
    @Pattern(regexp = "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")
    @Field("profissional_hora_inicio")
    private String profissionalHoraInicio;

    @NotNull(message = "must not be null")
    @Pattern(regexp = "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$")
    @Field("profissional_hora_fim")
    private String profissionalHoraFim;

    @DBRef
    @Field("estados")
    private Estados estados;

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

    public Profissionais id(String id) {
        this.id = id;
        return this;
    }

    public String getProfissionalNome() {
        return this.profissionalNome;
    }

    public Profissionais profissionalNome(String profissionalNome) {
        this.profissionalNome = profissionalNome;
        return this;
    }

    public void setProfissionalNome(String profissionalNome) {
        this.profissionalNome = profissionalNome;
    }

    public String getProfissionalHoraInicio() {
        return this.profissionalHoraInicio;
    }

    public Profissionais profissionalHoraInicio(String profissionalHoraInicio) {
        this.profissionalHoraInicio = profissionalHoraInicio;
        return this;
    }

    public void setProfissionalHoraInicio(String profissionalHoraInicio) {
        this.profissionalHoraInicio = profissionalHoraInicio;
    }

    public String getProfissionalHoraFim() {
        return this.profissionalHoraFim;
    }

    public Profissionais profissionalHoraFim(String profissionalHoraFim) {
        this.profissionalHoraFim = profissionalHoraFim;
        return this;
    }

    public void setProfissionalHoraFim(String profissionalHoraFim) {
        this.profissionalHoraFim = profissionalHoraFim;
    }

    public Estados getEstados() {
        return this.estados;
    }

    public Profissionais estados(Estados estados) {
        this.setEstados(estados);
        return this;
    }

    public void setEstados(Estados estados) {
        this.estados = estados;
    }

    public SetorSaude getSetorSaude() {
        return this.setorSaude;
    }

    public Profissionais setorSaude(SetorSaude setorSaude) {
        this.setSetorSaude(setorSaude);
        return this;
    }

    public void setSetorSaude(SetorSaude setorSaude) {
        this.setorSaude = setorSaude;
    }

    public Set<EntidadeSaude> getEntidadeNomes() {
        return this.entidadeNomes;
    }

    public Profissionais entidadeNomes(Set<EntidadeSaude> entidadeSaudes) {
        this.setEntidadeNomes(entidadeSaudes);
        return this;
    }

    public Profissionais addEntidadeNome(EntidadeSaude entidadeSaude) {
        this.entidadeNomes.add(entidadeSaude);
        entidadeSaude.getProfissionais().add(this);
        return this;
    }

    public Profissionais removeEntidadeNome(EntidadeSaude entidadeSaude) {
        this.entidadeNomes.remove(entidadeSaude);
        entidadeSaude.getProfissionais().remove(this);
        return this;
    }

    public void setEntidadeNomes(Set<EntidadeSaude> entidadeSaudes) {
        if (this.entidadeNomes != null) {
            this.entidadeNomes.forEach(i -> i.removeProfissionais(this));
        }
        if (entidadeSaudes != null) {
            entidadeSaudes.forEach(i -> i.addProfissionais(this));
        }
        this.entidadeNomes = entidadeSaudes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Profissionais)) {
            return false;
        }
        return id != null && id.equals(((Profissionais) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Profissionais{" +
            "id=" + getId() +
            ", profissionalNome='" + getProfissionalNome() + "'" +
            ", profissionalHoraInicio='" + getProfissionalHoraInicio() + "'" +
            ", profissionalHoraFim='" + getProfissionalHoraFim() + "'" +
            "}";
    }
}
