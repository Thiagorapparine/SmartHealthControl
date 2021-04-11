package com.smc.saude.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.smc.saude.domain.enumeration.SetorEntidade;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A EntidadeSaude.
 */
@Document(collection = "entidade_saude")
public class EntidadeSaude implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("entidade_nome")
    private String entidadeNome;

    @NotNull(message = "must not be null")
    @Field("entidade_setor")
    private SetorEntidade entidadeSetor;

    @NotNull(message = "must not be null")
    @Field("entidade_endereco")
    private String entidadeEndereco;

    @DBRef
    @Field("saudeTipo")
    private SaudeTipo saudeTipo;

    @DBRef
    @Field("estados")
    private Estados estados;

    @DBRef
    @Field("cidades")
    private Cidades cidades;

    @DBRef
    @Field("tiposProcedimentos")
    @JsonIgnoreProperties(value = { "setorSaude", "entidadeNomes" }, allowSetters = true)
    private Set<TiposProcedimento> tiposProcedimentos = new HashSet<>();

    @DBRef
    @Field("profissionais")
    @JsonIgnoreProperties(value = { "estados", "setorSaude", "entidadeNomes" }, allowSetters = true)
    private Set<Profissionais> profissionais = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public EntidadeSaude id(String id) {
        this.id = id;
        return this;
    }

    public String getEntidadeNome() {
        return this.entidadeNome;
    }

    public EntidadeSaude entidadeNome(String entidadeNome) {
        this.entidadeNome = entidadeNome;
        return this;
    }

    public void setEntidadeNome(String entidadeNome) {
        this.entidadeNome = entidadeNome;
    }

    public SetorEntidade getEntidadeSetor() {
        return this.entidadeSetor;
    }

    public EntidadeSaude entidadeSetor(SetorEntidade entidadeSetor) {
        this.entidadeSetor = entidadeSetor;
        return this;
    }

    public void setEntidadeSetor(SetorEntidade entidadeSetor) {
        this.entidadeSetor = entidadeSetor;
    }

    public String getEntidadeEndereco() {
        return this.entidadeEndereco;
    }

    public EntidadeSaude entidadeEndereco(String entidadeEndereco) {
        this.entidadeEndereco = entidadeEndereco;
        return this;
    }

    public void setEntidadeEndereco(String entidadeEndereco) {
        this.entidadeEndereco = entidadeEndereco;
    }

    public SaudeTipo getSaudeTipo() {
        return this.saudeTipo;
    }

    public EntidadeSaude saudeTipo(SaudeTipo saudeTipo) {
        this.setSaudeTipo(saudeTipo);
        return this;
    }

    public void setSaudeTipo(SaudeTipo saudeTipo) {
        this.saudeTipo = saudeTipo;
    }

    public Estados getEstados() {
        return this.estados;
    }

    public EntidadeSaude estados(Estados estados) {
        this.setEstados(estados);
        return this;
    }

    public void setEstados(Estados estados) {
        this.estados = estados;
    }

    public Cidades getCidades() {
        return this.cidades;
    }

    public EntidadeSaude cidades(Cidades cidades) {
        this.setCidades(cidades);
        return this;
    }

    public void setCidades(Cidades cidades) {
        this.cidades = cidades;
    }

    public Set<TiposProcedimento> getTiposProcedimentos() {
        return this.tiposProcedimentos;
    }

    public EntidadeSaude tiposProcedimentos(Set<TiposProcedimento> tiposProcedimentos) {
        this.setTiposProcedimentos(tiposProcedimentos);
        return this;
    }

    public EntidadeSaude addTiposProcedimento(TiposProcedimento tiposProcedimento) {
        this.tiposProcedimentos.add(tiposProcedimento);
        tiposProcedimento.getEntidadeNomes().add(this);
        return this;
    }

    public EntidadeSaude removeTiposProcedimento(TiposProcedimento tiposProcedimento) {
        this.tiposProcedimentos.remove(tiposProcedimento);
        tiposProcedimento.getEntidadeNomes().remove(this);
        return this;
    }

    public void setTiposProcedimentos(Set<TiposProcedimento> tiposProcedimentos) {
        this.tiposProcedimentos = tiposProcedimentos;
    }

    public Set<Profissionais> getProfissionais() {
        return this.profissionais;
    }

    public EntidadeSaude profissionais(Set<Profissionais> profissionais) {
        this.setProfissionais(profissionais);
        return this;
    }

    public EntidadeSaude addProfissionais(Profissionais profissionais) {
        this.profissionais.add(profissionais);
        profissionais.getEntidadeNomes().add(this);
        return this;
    }

    public EntidadeSaude removeProfissionais(Profissionais profissionais) {
        this.profissionais.remove(profissionais);
        profissionais.getEntidadeNomes().remove(this);
        return this;
    }

    public void setProfissionais(Set<Profissionais> profissionais) {
        this.profissionais = profissionais;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EntidadeSaude)) {
            return false;
        }
        return id != null && id.equals(((EntidadeSaude) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EntidadeSaude{" +
            "id=" + getId() +
            ", entidadeNome='" + getEntidadeNome() + "'" +
            ", entidadeSetor='" + getEntidadeSetor() + "'" +
            ", entidadeEndereco='" + getEntidadeEndereco() + "'" +
            "}";
    }
}
