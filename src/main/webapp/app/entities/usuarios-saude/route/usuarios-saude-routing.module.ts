import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UsuariosSaudeComponent } from '../list/usuarios-saude.component';
import { UsuariosSaudeDetailComponent } from '../detail/usuarios-saude-detail.component';
import { UsuariosSaudeUpdateComponent } from '../update/usuarios-saude-update.component';
import { UsuariosSaudeRoutingResolveService } from './usuarios-saude-routing-resolve.service';

const usuariosSaudeRoute: Routes = [
  {
    path: '',
    component: UsuariosSaudeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UsuariosSaudeDetailComponent,
    resolve: {
      usuariosSaude: UsuariosSaudeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UsuariosSaudeUpdateComponent,
    resolve: {
      usuariosSaude: UsuariosSaudeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UsuariosSaudeUpdateComponent,
    resolve: {
      usuariosSaude: UsuariosSaudeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(usuariosSaudeRoute)],
  exports: [RouterModule],
})
export class UsuariosSaudeRoutingModule {}
