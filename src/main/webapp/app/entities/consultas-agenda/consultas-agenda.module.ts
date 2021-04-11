import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ConsultasAgendaComponent } from './list/consultas-agenda.component';
import { ConsultasAgendaDetailComponent } from './detail/consultas-agenda-detail.component';
import { ConsultasAgendaUpdateComponent } from './update/consultas-agenda-update.component';
import { ConsultasAgendaDeleteDialogComponent } from './delete/consultas-agenda-delete-dialog.component';
import { ConsultasAgendaRoutingModule } from './route/consultas-agenda-routing.module';

@NgModule({
  imports: [SharedModule, ConsultasAgendaRoutingModule],
  declarations: [
    ConsultasAgendaComponent,
    ConsultasAgendaDetailComponent,
    ConsultasAgendaUpdateComponent,
    ConsultasAgendaDeleteDialogComponent,
  ],
  entryComponents: [ConsultasAgendaDeleteDialogComponent],
})
export class ConsultasAgendaModule {}
