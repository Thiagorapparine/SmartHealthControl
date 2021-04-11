package com.smc.saude.repository;

import com.smc.saude.domain.SetorSaude;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the SetorSaude entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SetorSaudeRepository extends ReactiveMongoRepository<SetorSaude, String> {}
