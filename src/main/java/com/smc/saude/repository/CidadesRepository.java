package com.smc.saude.repository;

import com.smc.saude.domain.Cidades;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the Cidades entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CidadesRepository extends ReactiveMongoRepository<Cidades, String> {}
