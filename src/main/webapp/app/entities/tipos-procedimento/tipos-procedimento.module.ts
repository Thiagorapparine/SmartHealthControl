import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TiposProcedimentoComponent } from './list/tipos-procedimento.component';
import { TiposProcedimentoDetailComponent } from './detail/tipos-procedimento-detail.component';
import { TiposProcedimentoUpdateComponent } from './update/tipos-procedimento-update.component';
import { TiposProcedimentoDeleteDialogComponent } from './delete/tipos-procedimento-delete-dialog.component';
import { TiposProcedimentoRoutingModule } from './route/tipos-procedimento-routing.module';

@NgModule({
  imports: [SharedModule, TiposProcedimentoRoutingModule],
  declarations: [
    TiposProcedimentoComponent,
    TiposProcedimentoDetailComponent,
    TiposProcedimentoUpdateComponent,
    TiposProcedimentoDeleteDialogComponent,
  ],
  entryComponents: [TiposProcedimentoDeleteDialogComponent],
})
export class TiposProcedimentoModule {}
