import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEntidadeSaude } from '../entidade-saude.model';
import { EntidadeSaudeService } from '../service/entidade-saude.service';

@Component({
  templateUrl: './entidade-saude-delete-dialog.component.html',
})
export class EntidadeSaudeDeleteDialogComponent {
  entidadeSaude?: IEntidadeSaude;

  constructor(protected entidadeSaudeService: EntidadeSaudeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.entidadeSaudeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
