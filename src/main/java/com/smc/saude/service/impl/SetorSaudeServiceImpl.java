package com.smc.saude.service.impl;

import com.smc.saude.domain.SetorSaude;
import com.smc.saude.repository.SetorSaudeRepository;
import com.smc.saude.service.SetorSaudeService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link SetorSaude}.
 */
@Service
public class SetorSaudeServiceImpl implements SetorSaudeService {

    private final Logger log = LoggerFactory.getLogger(SetorSaudeServiceImpl.class);

    private final SetorSaudeRepository setorSaudeRepository;

    public SetorSaudeServiceImpl(SetorSaudeRepository setorSaudeRepository) {
        this.setorSaudeRepository = setorSaudeRepository;
    }

    @Override
    public Mono<SetorSaude> save(SetorSaude setorSaude) {
        log.debug("Request to save SetorSaude : {}", setorSaude);
        return setorSaudeRepository.save(setorSaude);
    }

    @Override
    public Mono<SetorSaude> partialUpdate(SetorSaude setorSaude) {
        log.debug("Request to partially update SetorSaude : {}", setorSaude);

        return setorSaudeRepository
            .findById(setorSaude.getId())
            .map(
                existingSetorSaude -> {
                    if (setorSaude.getSetorSaude() != null) {
                        existingSetorSaude.setSetorSaude(setorSaude.getSetorSaude());
                    }

                    return existingSetorSaude;
                }
            )
            .flatMap(setorSaudeRepository::save);
    }

    @Override
    public Flux<SetorSaude> findAll() {
        log.debug("Request to get all SetorSaudes");
        return setorSaudeRepository.findAll();
    }

    public Mono<Long> countAll() {
        return setorSaudeRepository.count();
    }

    @Override
    public Mono<SetorSaude> findOne(String id) {
        log.debug("Request to get SetorSaude : {}", id);
        return setorSaudeRepository.findById(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete SetorSaude : {}", id);
        return setorSaudeRepository.deleteById(id);
    }
}
