import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExamesAgenda } from '../exames-agenda.model';
import { ExamesAgendaService } from '../service/exames-agenda.service';

@Component({
  templateUrl: './exames-agenda-delete-dialog.component.html',
})
export class ExamesAgendaDeleteDialogComponent {
  examesAgenda?: IExamesAgenda;

  constructor(protected examesAgendaService: ExamesAgendaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.examesAgendaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
