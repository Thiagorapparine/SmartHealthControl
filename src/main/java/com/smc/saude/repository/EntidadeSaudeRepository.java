package com.smc.saude.repository;

import com.smc.saude.domain.EntidadeSaude;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data MongoDB reactive repository for the EntidadeSaude entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EntidadeSaudeRepository extends ReactiveMongoRepository<EntidadeSaude, String> {
    @Query("{}")
    Flux<EntidadeSaude> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    Flux<EntidadeSaude> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Mono<EntidadeSaude> findOneWithEagerRelationships(String id);
}
