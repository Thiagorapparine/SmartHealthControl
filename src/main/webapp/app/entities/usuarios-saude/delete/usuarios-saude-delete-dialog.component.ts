import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsuariosSaude } from '../usuarios-saude.model';
import { UsuariosSaudeService } from '../service/usuarios-saude.service';

@Component({
  templateUrl: './usuarios-saude-delete-dialog.component.html',
})
export class UsuariosSaudeDeleteDialogComponent {
  usuariosSaude?: IUsuariosSaude;

  constructor(protected usuariosSaudeService: UsuariosSaudeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.usuariosSaudeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
