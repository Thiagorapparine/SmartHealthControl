package com.smc.saude.repository;

import com.smc.saude.domain.Profissionais;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the Profissionais entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProfissionaisRepository extends ReactiveMongoRepository<Profissionais, String> {}
