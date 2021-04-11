import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EntidadeSaudeComponent } from '../list/entidade-saude.component';
import { EntidadeSaudeDetailComponent } from '../detail/entidade-saude-detail.component';
import { EntidadeSaudeUpdateComponent } from '../update/entidade-saude-update.component';
import { EntidadeSaudeRoutingResolveService } from './entidade-saude-routing-resolve.service';

const entidadeSaudeRoute: Routes = [
  {
    path: '',
    component: EntidadeSaudeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EntidadeSaudeDetailComponent,
    resolve: {
      entidadeSaude: EntidadeSaudeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EntidadeSaudeUpdateComponent,
    resolve: {
      entidadeSaude: EntidadeSaudeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EntidadeSaudeUpdateComponent,
    resolve: {
      entidadeSaude: EntidadeSaudeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(entidadeSaudeRoute)],
  exports: [RouterModule],
})
export class EntidadeSaudeRoutingModule {}
