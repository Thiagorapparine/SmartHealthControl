import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { EntidadeSaudeComponent } from './list/entidade-saude.component';
import { EntidadeSaudeDetailComponent } from './detail/entidade-saude-detail.component';
import { EntidadeSaudeUpdateComponent } from './update/entidade-saude-update.component';
import { EntidadeSaudeDeleteDialogComponent } from './delete/entidade-saude-delete-dialog.component';
import { EntidadeSaudeRoutingModule } from './route/entidade-saude-routing.module';

@NgModule({
  imports: [SharedModule, EntidadeSaudeRoutingModule],
  declarations: [EntidadeSaudeComponent, EntidadeSaudeDetailComponent, EntidadeSaudeUpdateComponent, EntidadeSaudeDeleteDialogComponent],
  entryComponents: [EntidadeSaudeDeleteDialogComponent],
})
export class EntidadeSaudeModule {}
