import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISetorSaude } from '../setor-saude.model';
import { SetorSaudeService } from '../service/setor-saude.service';

@Component({
  templateUrl: './setor-saude-delete-dialog.component.html',
})
export class SetorSaudeDeleteDialogComponent {
  setorSaude?: ISetorSaude;

  constructor(protected setorSaudeService: SetorSaudeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.setorSaudeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
