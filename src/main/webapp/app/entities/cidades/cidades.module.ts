import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CidadesComponent } from './list/cidades.component';
import { CidadesDetailComponent } from './detail/cidades-detail.component';
import { CidadesUpdateComponent } from './update/cidades-update.component';
import { CidadesDeleteDialogComponent } from './delete/cidades-delete-dialog.component';
import { CidadesRoutingModule } from './route/cidades-routing.module';

@NgModule({
  imports: [SharedModule, CidadesRoutingModule],
  declarations: [CidadesComponent, CidadesDetailComponent, CidadesUpdateComponent, CidadesDeleteDialogComponent],
  entryComponents: [CidadesDeleteDialogComponent],
})
export class CidadesModule {}
