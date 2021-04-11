import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExamesAgendaComponent } from '../list/exames-agenda.component';
import { ExamesAgendaDetailComponent } from '../detail/exames-agenda-detail.component';
import { ExamesAgendaUpdateComponent } from '../update/exames-agenda-update.component';
import { ExamesAgendaRoutingResolveService } from './exames-agenda-routing-resolve.service';

const examesAgendaRoute: Routes = [
  {
    path: '',
    component: ExamesAgendaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExamesAgendaDetailComponent,
    resolve: {
      examesAgenda: ExamesAgendaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExamesAgendaUpdateComponent,
    resolve: {
      examesAgenda: ExamesAgendaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExamesAgendaUpdateComponent,
    resolve: {
      examesAgenda: ExamesAgendaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(examesAgendaRoute)],
  exports: [RouterModule],
})
export class ExamesAgendaRoutingModule {}
