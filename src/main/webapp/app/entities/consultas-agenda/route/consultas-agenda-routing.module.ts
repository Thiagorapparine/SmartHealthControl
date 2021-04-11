import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConsultasAgendaComponent } from '../list/consultas-agenda.component';
import { ConsultasAgendaDetailComponent } from '../detail/consultas-agenda-detail.component';
import { ConsultasAgendaUpdateComponent } from '../update/consultas-agenda-update.component';
import { ConsultasAgendaRoutingResolveService } from './consultas-agenda-routing-resolve.service';

const consultasAgendaRoute: Routes = [
  {
    path: '',
    component: ConsultasAgendaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConsultasAgendaDetailComponent,
    resolve: {
      consultasAgenda: ConsultasAgendaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConsultasAgendaUpdateComponent,
    resolve: {
      consultasAgenda: ConsultasAgendaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConsultasAgendaUpdateComponent,
    resolve: {
      consultasAgenda: ConsultasAgendaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(consultasAgendaRoute)],
  exports: [RouterModule],
})
export class ConsultasAgendaRoutingModule {}
