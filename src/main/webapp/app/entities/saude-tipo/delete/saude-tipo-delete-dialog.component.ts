import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISaudeTipo } from '../saude-tipo.model';
import { SaudeTipoService } from '../service/saude-tipo.service';

@Component({
  templateUrl: './saude-tipo-delete-dialog.component.html',
})
export class SaudeTipoDeleteDialogComponent {
  saudeTipo?: ISaudeTipo;

  constructor(protected saudeTipoService: SaudeTipoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.saudeTipoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
