import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { UsuariosSaudeComponent } from './list/usuarios-saude.component';
import { UsuariosSaudeDetailComponent } from './detail/usuarios-saude-detail.component';
import { UsuariosSaudeUpdateComponent } from './update/usuarios-saude-update.component';
import { UsuariosSaudeDeleteDialogComponent } from './delete/usuarios-saude-delete-dialog.component';
import { UsuariosSaudeRoutingModule } from './route/usuarios-saude-routing.module';

@NgModule({
  imports: [SharedModule, UsuariosSaudeRoutingModule],
  declarations: [UsuariosSaudeComponent, UsuariosSaudeDetailComponent, UsuariosSaudeUpdateComponent, UsuariosSaudeDeleteDialogComponent],
  entryComponents: [UsuariosSaudeDeleteDialogComponent],
})
export class UsuariosSaudeModule {}
