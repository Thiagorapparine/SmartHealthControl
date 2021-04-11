import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SaudeTipoComponent } from './list/saude-tipo.component';
import { SaudeTipoDetailComponent } from './detail/saude-tipo-detail.component';
import { SaudeTipoUpdateComponent } from './update/saude-tipo-update.component';
import { SaudeTipoDeleteDialogComponent } from './delete/saude-tipo-delete-dialog.component';
import { SaudeTipoRoutingModule } from './route/saude-tipo-routing.module';

@NgModule({
  imports: [SharedModule, SaudeTipoRoutingModule],
  declarations: [SaudeTipoComponent, SaudeTipoDetailComponent, SaudeTipoUpdateComponent, SaudeTipoDeleteDialogComponent],
  entryComponents: [SaudeTipoDeleteDialogComponent],
})
export class SaudeTipoModule {}
