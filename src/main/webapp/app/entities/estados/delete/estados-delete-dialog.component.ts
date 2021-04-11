import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstados } from '../estados.model';
import { EstadosService } from '../service/estados.service';

@Component({
  templateUrl: './estados-delete-dialog.component.html',
})
export class EstadosDeleteDialogComponent {
  estados?: IEstados;

  constructor(protected estadosService: EstadosService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.estadosService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
