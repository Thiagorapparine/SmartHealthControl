import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfissionais } from '../profissionais.model';
import { ProfissionaisService } from '../service/profissionais.service';

@Component({
  templateUrl: './profissionais-delete-dialog.component.html',
})
export class ProfissionaisDeleteDialogComponent {
  profissionais?: IProfissionais;

  constructor(protected profissionaisService: ProfissionaisService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.profissionaisService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
