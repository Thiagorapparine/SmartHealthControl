import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { EstadosComponent } from './list/estados.component';
import { EstadosDetailComponent } from './detail/estados-detail.component';
import { EstadosUpdateComponent } from './update/estados-update.component';
import { EstadosDeleteDialogComponent } from './delete/estados-delete-dialog.component';
import { EstadosRoutingModule } from './route/estados-routing.module';

@NgModule({
  imports: [SharedModule, EstadosRoutingModule],
  declarations: [EstadosComponent, EstadosDetailComponent, EstadosUpdateComponent, EstadosDeleteDialogComponent],
  entryComponents: [EstadosDeleteDialogComponent],
})
export class EstadosModule {}
