package com.smc.saude.repository;

import com.smc.saude.domain.SaudeTipo;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the SaudeTipo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SaudeTipoRepository extends ReactiveMongoRepository<SaudeTipo, String> {}
