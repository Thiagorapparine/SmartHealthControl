import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITiposProcedimento } from '../tipos-procedimento.model';
import { TiposProcedimentoService } from '../service/tipos-procedimento.service';

@Component({
  templateUrl: './tipos-procedimento-delete-dialog.component.html',
})
export class TiposProcedimentoDeleteDialogComponent {
  tiposProcedimento?: ITiposProcedimento;

  constructor(protected tiposProcedimentoService: TiposProcedimentoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.tiposProcedimentoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
