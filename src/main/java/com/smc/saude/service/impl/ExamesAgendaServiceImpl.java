package com.smc.saude.service.impl;

import com.smc.saude.domain.ExamesAgenda;
import com.smc.saude.repository.ExamesAgendaRepository;
import com.smc.saude.service.ExamesAgendaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link ExamesAgenda}.
 */
@Service
public class ExamesAgendaServiceImpl implements ExamesAgendaService {

    private final Logger log = LoggerFactory.getLogger(ExamesAgendaServiceImpl.class);

    private final ExamesAgendaRepository examesAgendaRepository;

    public ExamesAgendaServiceImpl(ExamesAgendaRepository examesAgendaRepository) {
        this.examesAgendaRepository = examesAgendaRepository;
    }

    @Override
    public Mono<ExamesAgenda> save(ExamesAgenda examesAgenda) {
        log.debug("Request to save ExamesAgenda : {}", examesAgenda);
        return examesAgendaRepository.save(examesAgenda);
    }

    @Override
    public Mono<ExamesAgenda> partialUpdate(ExamesAgenda examesAgenda) {
        log.debug("Request to partially update ExamesAgenda : {}", examesAgenda);

        return examesAgendaRepository
            .findById(examesAgenda.getId())
            .map(
                existingExamesAgenda -> {
                    if (examesAgenda.getAgendamentoData() != null) {
                        existingExamesAgenda.setAgendamentoData(examesAgenda.getAgendamentoData());
                    }

                    return existingExamesAgenda;
                }
            )
            .flatMap(examesAgendaRepository::save);
    }

    @Override
    public Flux<ExamesAgenda> findAll(Pageable pageable) {
        log.debug("Request to get all ExamesAgenda");
        return examesAgendaRepository.findAllBy(pageable);
    }

    public Mono<Long> countAll() {
        return examesAgendaRepository.count();
    }

    @Override
    public Mono<ExamesAgenda> findOne(String id) {
        log.debug("Request to get ExamesAgenda : {}", id);
        return examesAgendaRepository.findById(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete ExamesAgenda : {}", id);
        return examesAgendaRepository.deleteById(id);
    }
}
