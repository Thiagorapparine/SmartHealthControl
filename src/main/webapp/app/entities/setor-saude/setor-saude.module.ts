import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SetorSaudeComponent } from './list/setor-saude.component';
import { SetorSaudeDetailComponent } from './detail/setor-saude-detail.component';
import { SetorSaudeUpdateComponent } from './update/setor-saude-update.component';
import { SetorSaudeDeleteDialogComponent } from './delete/setor-saude-delete-dialog.component';
import { SetorSaudeRoutingModule } from './route/setor-saude-routing.module';

@NgModule({
  imports: [SharedModule, SetorSaudeRoutingModule],
  declarations: [SetorSaudeComponent, SetorSaudeDetailComponent, SetorSaudeUpdateComponent, SetorSaudeDeleteDialogComponent],
  entryComponents: [SetorSaudeDeleteDialogComponent],
})
export class SetorSaudeModule {}
