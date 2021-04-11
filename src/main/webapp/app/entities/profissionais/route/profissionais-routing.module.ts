import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfissionaisComponent } from '../list/profissionais.component';
import { ProfissionaisDetailComponent } from '../detail/profissionais-detail.component';
import { ProfissionaisUpdateComponent } from '../update/profissionais-update.component';
import { ProfissionaisRoutingResolveService } from './profissionais-routing-resolve.service';

const profissionaisRoute: Routes = [
  {
    path: '',
    component: ProfissionaisComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProfissionaisDetailComponent,
    resolve: {
      profissionais: ProfissionaisRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProfissionaisUpdateComponent,
    resolve: {
      profissionais: ProfissionaisRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProfissionaisUpdateComponent,
    resolve: {
      profissionais: ProfissionaisRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(profissionaisRoute)],
  exports: [RouterModule],
})
export class ProfissionaisRoutingModule {}
