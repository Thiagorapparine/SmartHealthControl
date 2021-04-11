package com.smc.saude.repository;

import com.smc.saude.domain.TiposProcedimento;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the TiposProcedimento entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TiposProcedimentoRepository extends ReactiveMongoRepository<TiposProcedimento, String> {}
