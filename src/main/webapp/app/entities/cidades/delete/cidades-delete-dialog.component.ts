import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICidades } from '../cidades.model';
import { CidadesService } from '../service/cidades.service';

@Component({
  templateUrl: './cidades-delete-dialog.component.html',
})
export class CidadesDeleteDialogComponent {
  cidades?: ICidades;

  constructor(protected cidadesService: CidadesService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.cidadesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
