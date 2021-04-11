package com.smc.saude.service.impl;

import com.smc.saude.domain.SaudeTipo;
import com.smc.saude.repository.SaudeTipoRepository;
import com.smc.saude.service.SaudeTipoService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link SaudeTipo}.
 */
@Service
public class SaudeTipoServiceImpl implements SaudeTipoService {

    private final Logger log = LoggerFactory.getLogger(SaudeTipoServiceImpl.class);

    private final SaudeTipoRepository saudeTipoRepository;

    public SaudeTipoServiceImpl(SaudeTipoRepository saudeTipoRepository) {
        this.saudeTipoRepository = saudeTipoRepository;
    }

    @Override
    public Mono<SaudeTipo> save(SaudeTipo saudeTipo) {
        log.debug("Request to save SaudeTipo : {}", saudeTipo);
        return saudeTipoRepository.save(saudeTipo);
    }

    @Override
    public Mono<SaudeTipo> partialUpdate(SaudeTipo saudeTipo) {
        log.debug("Request to partially update SaudeTipo : {}", saudeTipo);

        return saudeTipoRepository
            .findById(saudeTipo.getId())
            .map(
                existingSaudeTipo -> {
                    if (saudeTipo.getTipoIdentificacao() != null) {
                        existingSaudeTipo.setTipoIdentificacao(saudeTipo.getTipoIdentificacao());
                    }
                    if (saudeTipo.getTipoDescricao() != null) {
                        existingSaudeTipo.setTipoDescricao(saudeTipo.getTipoDescricao());
                    }

                    return existingSaudeTipo;
                }
            )
            .flatMap(saudeTipoRepository::save);
    }

    @Override
    public Flux<SaudeTipo> findAll() {
        log.debug("Request to get all SaudeTipos");
        return saudeTipoRepository.findAll();
    }

    public Mono<Long> countAll() {
        return saudeTipoRepository.count();
    }

    @Override
    public Mono<SaudeTipo> findOne(String id) {
        log.debug("Request to get SaudeTipo : {}", id);
        return saudeTipoRepository.findById(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete SaudeTipo : {}", id);
        return saudeTipoRepository.deleteById(id);
    }
}
