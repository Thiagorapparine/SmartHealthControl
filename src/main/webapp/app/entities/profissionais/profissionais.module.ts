import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProfissionaisComponent } from './list/profissionais.component';
import { ProfissionaisDetailComponent } from './detail/profissionais-detail.component';
import { ProfissionaisUpdateComponent } from './update/profissionais-update.component';
import { ProfissionaisDeleteDialogComponent } from './delete/profissionais-delete-dialog.component';
import { ProfissionaisRoutingModule } from './route/profissionais-routing.module';

@NgModule({
  imports: [SharedModule, ProfissionaisRoutingModule],
  declarations: [ProfissionaisComponent, ProfissionaisDetailComponent, ProfissionaisUpdateComponent, ProfissionaisDeleteDialogComponent],
  entryComponents: [ProfissionaisDeleteDialogComponent],
})
export class ProfissionaisModule {}
