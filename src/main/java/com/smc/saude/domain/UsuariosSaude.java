package com.smc.saude.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A UsuariosSaude.
 */
@Document(collection = "usuarios_saude")
public class UsuariosSaude implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("usuario_foto")
    private byte[] usuarioFoto;

    @Field("usuario_foto_content_type")
    private String usuarioFotoContentType;

    @NotNull(message = "must not be null")
    @Field("usuario_nome")
    private String usuarioNome;

    @NotNull(message = "must not be null")
    @Pattern(regexp = "[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}\\-?[0-9]{2}")
    @Field("usuario_cpf")
    private String usuarioCPF;

    @NotNull(message = "must not be null")
    @Pattern(regexp = "[0-9]{2}[-|\\/]{1}[0-9]{2}[-|\\/]{1}[0-9]{4}")
    @Field("usuario_data_nascimento")
    private String usuarioDataNascimento;

    @DBRef
    @Field("user")
    private User user;

    @DBRef
    @Field("cidades")
    private Cidades cidades;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UsuariosSaude id(String id) {
        this.id = id;
        return this;
    }

    public byte[] getUsuarioFoto() {
        return this.usuarioFoto;
    }

    public UsuariosSaude usuarioFoto(byte[] usuarioFoto) {
        this.usuarioFoto = usuarioFoto;
        return this;
    }

    public void setUsuarioFoto(byte[] usuarioFoto) {
        this.usuarioFoto = usuarioFoto;
    }

    public String getUsuarioFotoContentType() {
        return this.usuarioFotoContentType;
    }

    public UsuariosSaude usuarioFotoContentType(String usuarioFotoContentType) {
        this.usuarioFotoContentType = usuarioFotoContentType;
        return this;
    }

    public void setUsuarioFotoContentType(String usuarioFotoContentType) {
        this.usuarioFotoContentType = usuarioFotoContentType;
    }

    public String getUsuarioNome() {
        return this.usuarioNome;
    }

    public UsuariosSaude usuarioNome(String usuarioNome) {
        this.usuarioNome = usuarioNome;
        return this;
    }

    public void setUsuarioNome(String usuarioNome) {
        this.usuarioNome = usuarioNome;
    }

    public String getUsuarioCPF() {
        return this.usuarioCPF;
    }

    public UsuariosSaude usuarioCPF(String usuarioCPF) {
        this.usuarioCPF = usuarioCPF;
        return this;
    }

    public void setUsuarioCPF(String usuarioCPF) {
        this.usuarioCPF = usuarioCPF;
    }

    public String getUsuarioDataNascimento() {
        return this.usuarioDataNascimento;
    }

    public UsuariosSaude usuarioDataNascimento(String usuarioDataNascimento) {
        this.usuarioDataNascimento = usuarioDataNascimento;
        return this;
    }

    public void setUsuarioDataNascimento(String usuarioDataNascimento) {
        this.usuarioDataNascimento = usuarioDataNascimento;
    }

    public User getUser() {
        return this.user;
    }

    public UsuariosSaude user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Cidades getCidades() {
        return this.cidades;
    }

    public UsuariosSaude cidades(Cidades cidades) {
        this.setCidades(cidades);
        return this;
    }

    public void setCidades(Cidades cidades) {
        this.cidades = cidades;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UsuariosSaude)) {
            return false;
        }
        return id != null && id.equals(((UsuariosSaude) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UsuariosSaude{" +
            "id=" + getId() +
            ", usuarioFoto='" + getUsuarioFoto() + "'" +
            ", usuarioFotoContentType='" + getUsuarioFotoContentType() + "'" +
            ", usuarioNome='" + getUsuarioNome() + "'" +
            ", usuarioCPF='" + getUsuarioCPF() + "'" +
            ", usuarioDataNascimento='" + getUsuarioDataNascimento() + "'" +
            "}";
    }
}
