import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EstadosComponent } from '../list/estados.component';
import { EstadosDetailComponent } from '../detail/estados-detail.component';
import { EstadosUpdateComponent } from '../update/estados-update.component';
import { EstadosRoutingResolveService } from './estados-routing-resolve.service';

const estadosRoute: Routes = [
  {
    path: '',
    component: EstadosComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EstadosDetailComponent,
    resolve: {
      estados: EstadosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EstadosUpdateComponent,
    resolve: {
      estados: EstadosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EstadosUpdateComponent,
    resolve: {
      estados: EstadosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estadosRoute)],
  exports: [RouterModule],
})
export class EstadosRoutingModule {}
