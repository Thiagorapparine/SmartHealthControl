package com.smc.saude.service.impl;

import com.smc.saude.domain.ConsultasAgenda;
import com.smc.saude.repository.ConsultasAgendaRepository;
import com.smc.saude.service.ConsultasAgendaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link ConsultasAgenda}.
 */
@Service
public class ConsultasAgendaServiceImpl implements ConsultasAgendaService {

    private final Logger log = LoggerFactory.getLogger(ConsultasAgendaServiceImpl.class);

    private final ConsultasAgendaRepository consultasAgendaRepository;

    public ConsultasAgendaServiceImpl(ConsultasAgendaRepository consultasAgendaRepository) {
        this.consultasAgendaRepository = consultasAgendaRepository;
    }

    @Override
    public Mono<ConsultasAgenda> save(ConsultasAgenda consultasAgenda) {
        log.debug("Request to save ConsultasAgenda : {}", consultasAgenda);
        return consultasAgendaRepository.save(consultasAgenda);
    }

    @Override
    public Mono<ConsultasAgenda> partialUpdate(ConsultasAgenda consultasAgenda) {
        log.debug("Request to partially update ConsultasAgenda : {}", consultasAgenda);

        return consultasAgendaRepository
            .findById(consultasAgenda.getId())
            .map(
                existingConsultasAgenda -> {
                    if (consultasAgenda.getAgendamentoData() != null) {
                        existingConsultasAgenda.setAgendamentoData(consultasAgenda.getAgendamentoData());
                    }

                    return existingConsultasAgenda;
                }
            )
            .flatMap(consultasAgendaRepository::save);
    }

    @Override
    public Flux<ConsultasAgenda> findAll(Pageable pageable) {
        log.debug("Request to get all ConsultasAgenda");
        return consultasAgendaRepository.findAllBy(pageable);
    }

    public Mono<Long> countAll() {
        return consultasAgendaRepository.count();
    }

    @Override
    public Mono<ConsultasAgenda> findOne(String id) {
        log.debug("Request to get ConsultasAgenda : {}", id);
        return consultasAgendaRepository.findById(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete ConsultasAgenda : {}", id);
        return consultasAgendaRepository.deleteById(id);
    }
}
