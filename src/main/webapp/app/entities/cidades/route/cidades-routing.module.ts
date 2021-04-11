import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CidadesComponent } from '../list/cidades.component';
import { CidadesDetailComponent } from '../detail/cidades-detail.component';
import { CidadesUpdateComponent } from '../update/cidades-update.component';
import { CidadesRoutingResolveService } from './cidades-routing-resolve.service';

const cidadesRoute: Routes = [
  {
    path: '',
    component: CidadesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CidadesDetailComponent,
    resolve: {
      cidades: CidadesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CidadesUpdateComponent,
    resolve: {
      cidades: CidadesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CidadesUpdateComponent,
    resolve: {
      cidades: CidadesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cidadesRoute)],
  exports: [RouterModule],
})
export class CidadesRoutingModule {}
