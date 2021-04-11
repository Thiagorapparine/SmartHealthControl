import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TiposProcedimentoComponent } from '../list/tipos-procedimento.component';
import { TiposProcedimentoDetailComponent } from '../detail/tipos-procedimento-detail.component';
import { TiposProcedimentoUpdateComponent } from '../update/tipos-procedimento-update.component';
import { TiposProcedimentoRoutingResolveService } from './tipos-procedimento-routing-resolve.service';

const tiposProcedimentoRoute: Routes = [
  {
    path: '',
    component: TiposProcedimentoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TiposProcedimentoDetailComponent,
    resolve: {
      tiposProcedimento: TiposProcedimentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TiposProcedimentoUpdateComponent,
    resolve: {
      tiposProcedimento: TiposProcedimentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TiposProcedimentoUpdateComponent,
    resolve: {
      tiposProcedimento: TiposProcedimentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tiposProcedimentoRoute)],
  exports: [RouterModule],
})
export class TiposProcedimentoRoutingModule {}
