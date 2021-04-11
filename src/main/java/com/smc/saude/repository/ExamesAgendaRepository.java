package com.smc.saude.repository;

import com.smc.saude.domain.ExamesAgenda;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

/**
 * Spring Data MongoDB reactive repository for the ExamesAgenda entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExamesAgendaRepository extends ReactiveMongoRepository<ExamesAgenda, String> {
    Flux<ExamesAgenda> findAllBy(Pageable pageable);
}
