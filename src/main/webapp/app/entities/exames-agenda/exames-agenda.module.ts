import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ExamesAgendaComponent } from './list/exames-agenda.component';
import { ExamesAgendaDetailComponent } from './detail/exames-agenda-detail.component';
import { ExamesAgendaUpdateComponent } from './update/exames-agenda-update.component';
import { ExamesAgendaDeleteDialogComponent } from './delete/exames-agenda-delete-dialog.component';
import { ExamesAgendaRoutingModule } from './route/exames-agenda-routing.module';

@NgModule({
  imports: [SharedModule, ExamesAgendaRoutingModule],
  declarations: [ExamesAgendaComponent, ExamesAgendaDetailComponent, ExamesAgendaUpdateComponent, ExamesAgendaDeleteDialogComponent],
  entryComponents: [ExamesAgendaDeleteDialogComponent],
})
export class ExamesAgendaModule {}
