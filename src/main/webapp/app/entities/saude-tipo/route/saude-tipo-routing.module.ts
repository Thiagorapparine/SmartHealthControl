import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SaudeTipoComponent } from '../list/saude-tipo.component';
import { SaudeTipoDetailComponent } from '../detail/saude-tipo-detail.component';
import { SaudeTipoUpdateComponent } from '../update/saude-tipo-update.component';
import { SaudeTipoRoutingResolveService } from './saude-tipo-routing-resolve.service';

const saudeTipoRoute: Routes = [
  {
    path: '',
    component: SaudeTipoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SaudeTipoDetailComponent,
    resolve: {
      saudeTipo: SaudeTipoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SaudeTipoUpdateComponent,
    resolve: {
      saudeTipo: SaudeTipoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SaudeTipoUpdateComponent,
    resolve: {
      saudeTipo: SaudeTipoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(saudeTipoRoute)],
  exports: [RouterModule],
})
export class SaudeTipoRoutingModule {}
