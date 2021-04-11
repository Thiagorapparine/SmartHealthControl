package com.smc.saude.service.impl;

import com.smc.saude.domain.TiposProcedimento;
import com.smc.saude.repository.TiposProcedimentoRepository;
import com.smc.saude.service.TiposProcedimentoService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link TiposProcedimento}.
 */
@Service
public class TiposProcedimentoServiceImpl implements TiposProcedimentoService {

    private final Logger log = LoggerFactory.getLogger(TiposProcedimentoServiceImpl.class);

    private final TiposProcedimentoRepository tiposProcedimentoRepository;

    public TiposProcedimentoServiceImpl(TiposProcedimentoRepository tiposProcedimentoRepository) {
        this.tiposProcedimentoRepository = tiposProcedimentoRepository;
    }

    @Override
    public Mono<TiposProcedimento> save(TiposProcedimento tiposProcedimento) {
        log.debug("Request to save TiposProcedimento : {}", tiposProcedimento);
        return tiposProcedimentoRepository.save(tiposProcedimento);
    }

    @Override
    public Mono<TiposProcedimento> partialUpdate(TiposProcedimento tiposProcedimento) {
        log.debug("Request to partially update TiposProcedimento : {}", tiposProcedimento);

        return tiposProcedimentoRepository
            .findById(tiposProcedimento.getId())
            .map(
                existingTiposProcedimento -> {
                    if (tiposProcedimento.getProcedimentoNome() != null) {
                        existingTiposProcedimento.setProcedimentoNome(tiposProcedimento.getProcedimentoNome());
                    }
                    if (tiposProcedimento.getProcedimentoDescricao() != null) {
                        existingTiposProcedimento.setProcedimentoDescricao(tiposProcedimento.getProcedimentoDescricao());
                    }

                    return existingTiposProcedimento;
                }
            )
            .flatMap(tiposProcedimentoRepository::save);
    }

    @Override
    public Flux<TiposProcedimento> findAll() {
        log.debug("Request to get all TiposProcedimentos");
        return tiposProcedimentoRepository.findAll();
    }

    public Mono<Long> countAll() {
        return tiposProcedimentoRepository.count();
    }

    @Override
    public Mono<TiposProcedimento> findOne(String id) {
        log.debug("Request to get TiposProcedimento : {}", id);
        return tiposProcedimentoRepository.findById(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete TiposProcedimento : {}", id);
        return tiposProcedimentoRepository.deleteById(id);
    }
}
