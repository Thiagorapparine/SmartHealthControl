package com.smc.saude.repository;

import com.smc.saude.domain.UsuariosSaude;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the UsuariosSaude entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UsuariosSaudeRepository extends ReactiveMongoRepository<UsuariosSaude, String> {}
