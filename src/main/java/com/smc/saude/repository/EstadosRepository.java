package com.smc.saude.repository;

import com.smc.saude.domain.Estados;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the Estados entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EstadosRepository extends ReactiveMongoRepository<Estados, String> {}
