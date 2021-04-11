package com.smc.saude.repository;

import com.smc.saude.domain.ConsultasAgenda;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

/**
 * Spring Data MongoDB reactive repository for the ConsultasAgenda entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConsultasAgendaRepository extends ReactiveMongoRepository<ConsultasAgenda, String> {
    Flux<ConsultasAgenda> findAllBy(Pageable pageable);
}
