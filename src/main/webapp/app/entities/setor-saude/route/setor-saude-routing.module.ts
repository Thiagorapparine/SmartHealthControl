import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SetorSaudeComponent } from '../list/setor-saude.component';
import { SetorSaudeDetailComponent } from '../detail/setor-saude-detail.component';
import { SetorSaudeUpdateComponent } from '../update/setor-saude-update.component';
import { SetorSaudeRoutingResolveService } from './setor-saude-routing-resolve.service';

const setorSaudeRoute: Routes = [
  {
    path: '',
    component: SetorSaudeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SetorSaudeDetailComponent,
    resolve: {
      setorSaude: SetorSaudeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SetorSaudeUpdateComponent,
    resolve: {
      setorSaude: SetorSaudeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SetorSaudeUpdateComponent,
    resolve: {
      setorSaude: SetorSaudeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(setorSaudeRoute)],
  exports: [RouterModule],
})
export class SetorSaudeRoutingModule {}
