package com.smc.saude.service.impl;

import com.smc.saude.domain.UsuariosSaude;
import com.smc.saude.repository.UsuariosSaudeRepository;
import com.smc.saude.service.UsuariosSaudeService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link UsuariosSaude}.
 */
@Service
public class UsuariosSaudeServiceImpl implements UsuariosSaudeService {

    private final Logger log = LoggerFactory.getLogger(UsuariosSaudeServiceImpl.class);

    private final UsuariosSaudeRepository usuariosSaudeRepository;

    public UsuariosSaudeServiceImpl(UsuariosSaudeRepository usuariosSaudeRepository) {
        this.usuariosSaudeRepository = usuariosSaudeRepository;
    }

    @Override
    public Mono<UsuariosSaude> save(UsuariosSaude usuariosSaude) {
        log.debug("Request to save UsuariosSaude : {}", usuariosSaude);
        return usuariosSaudeRepository.save(usuariosSaude);
    }

    @Override
    public Mono<UsuariosSaude> partialUpdate(UsuariosSaude usuariosSaude) {
        log.debug("Request to partially update UsuariosSaude : {}", usuariosSaude);

        return usuariosSaudeRepository
            .findById(usuariosSaude.getId())
            .map(
                existingUsuariosSaude -> {
                    if (usuariosSaude.getUsuarioFoto() != null) {
                        existingUsuariosSaude.setUsuarioFoto(usuariosSaude.getUsuarioFoto());
                    }
                    if (usuariosSaude.getUsuarioFotoContentType() != null) {
                        existingUsuariosSaude.setUsuarioFotoContentType(usuariosSaude.getUsuarioFotoContentType());
                    }
                    if (usuariosSaude.getUsuarioNome() != null) {
                        existingUsuariosSaude.setUsuarioNome(usuariosSaude.getUsuarioNome());
                    }
                    if (usuariosSaude.getUsuarioCPF() != null) {
                        existingUsuariosSaude.setUsuarioCPF(usuariosSaude.getUsuarioCPF());
                    }
                    if (usuariosSaude.getUsuarioDataNascimento() != null) {
                        existingUsuariosSaude.setUsuarioDataNascimento(usuariosSaude.getUsuarioDataNascimento());
                    }

                    return existingUsuariosSaude;
                }
            )
            .flatMap(usuariosSaudeRepository::save);
    }

    @Override
    public Flux<UsuariosSaude> findAll() {
        log.debug("Request to get all UsuariosSaudes");
        return usuariosSaudeRepository.findAll();
    }

    public Mono<Long> countAll() {
        return usuariosSaudeRepository.count();
    }

    @Override
    public Mono<UsuariosSaude> findOne(String id) {
        log.debug("Request to get UsuariosSaude : {}", id);
        return usuariosSaudeRepository.findById(id);
    }

    @Override
    public Mono<Void> delete(String id) {
        log.debug("Request to delete UsuariosSaude : {}", id);
        return usuariosSaudeRepository.deleteById(id);
    }
}
