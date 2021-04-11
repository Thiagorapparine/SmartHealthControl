import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'entidade-saude',
        data: { pageTitle: 'tccSmartHealthControlApp.entidadeSaude.home.title' },
        loadChildren: () => import('./entidade-saude/entidade-saude.module').then(m => m.EntidadeSaudeModule),
      },
      {
        path: 'saude-tipo',
        data: { pageTitle: 'tccSmartHealthControlApp.saudeTipo.home.title' },
        loadChildren: () => import('./saude-tipo/saude-tipo.module').then(m => m.SaudeTipoModule),
      },
      {
        path: 'profissionais',
        data: { pageTitle: 'tccSmartHealthControlApp.profissionais.home.title' },
        loadChildren: () => import('./profissionais/profissionais.module').then(m => m.ProfissionaisModule),
      },
      {
        path: 'setor-saude',
        data: { pageTitle: 'tccSmartHealthControlApp.setorSaude.home.title' },
        loadChildren: () => import('./setor-saude/setor-saude.module').then(m => m.SetorSaudeModule),
      },
      {
        path: 'usuarios-saude',
        data: { pageTitle: 'tccSmartHealthControlApp.usuariosSaude.home.title' },
        loadChildren: () => import('./usuarios-saude/usuarios-saude.module').then(m => m.UsuariosSaudeModule),
      },
      {
        path: 'estados',
        data: { pageTitle: 'tccSmartHealthControlApp.estados.home.title' },
        loadChildren: () => import('./estados/estados.module').then(m => m.EstadosModule),
      },
      {
        path: 'cidades',
        data: { pageTitle: 'tccSmartHealthControlApp.cidades.home.title' },
        loadChildren: () => import('./cidades/cidades.module').then(m => m.CidadesModule),
      },
      {
        path: 'tipos-procedimento',
        data: { pageTitle: 'tccSmartHealthControlApp.tiposProcedimento.home.title' },
        loadChildren: () => import('./tipos-procedimento/tipos-procedimento.module').then(m => m.TiposProcedimentoModule),
      },
      {
        path: 'exames-agenda',
        data: { pageTitle: 'tccSmartHealthControlApp.examesAgenda.home.title' },
        loadChildren: () => import('./exames-agenda/exames-agenda.module').then(m => m.ExamesAgendaModule),
      },
      {
        path: 'consultas-agenda',
        data: { pageTitle: 'tccSmartHealthControlApp.consultasAgenda.home.title' },
        loadChildren: () => import('./consultas-agenda/consultas-agenda.module').then(m => m.ConsultasAgendaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
