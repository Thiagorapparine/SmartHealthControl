package com.smc.saude.service.impl;

import com.smc.saude.domain.Profissionais;
import com.smc.saude.repository.ProfissionaisRepository;
import com.smc.saude.service.ProfissionaisService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Profissionais}.
 */
@Service
public class ProfissionaisServiceImpl implements ProfissionaisService {

    private final Logger log = LoggerFactory.getLogger(ProfissionaisServiceImpl.class);

    private final ProfissionaisRepository profissionaisRepository;

    public ProfissionaisServiceImpl(ProfissionaisRepository profissionaisRepository) {
        this.profissionaisRepository = profissionaisRepository;
    }

    @Override
    public Mono<Profissionais> save(Profissionais profissionais) {
        log.debug("Request to save Profissionais : {}", profissionais);
        return profissionaisRepository.save(profissionais);
    }

    @Override
    public Mono<Profissionais> partialUpdate(Profissionais profissionais) {
        log.debug("Request to partially update Profissionais : {}", profissionais);

        return profissionaisRepository
            .findById(profissionais.getId())
            .map(
                existingProfissionais -> {
                    if (profissionais.getProfissionalNome() != null) {
                        existingProfissionais.setProfissionalNome(profissionais.getProfissionalNome());
                    }
                    if (profissionais.getProfissionalHoraInicio() != null) {
                        existingProfissionais.setProfissionalHoraInicio(profissionais.getProfissionalHoraInicio());
                    }
                    if (profissionais.getProfissionalHoraFim() != null) {
                        existingProfissionais.setProfissionalHoraFim(profissionais.getProfissionalHoraFim());
                    }

                    return existingProfissionais;
                }
            )
            .flatMap(profissionaisRepository::save);
    }

    @Override
    public Flux<Profissionais> findAll() {
        log.debug("Request to get all Profissionais");
        return profissionaisRepository.findAll();
    }

    public Mono<Long> countAll() {
        return profissionaisRepository.count();
    }

    @Override
    public Mono<Profissionais> findOne(String id) {
        log.debug("Request to get Profissionais : {}", id);
        return profissionaisRepository.findById(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete Profissionais : {}", id);
        return profissionaisRepository.deleteById(id);
    }
}
