import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsultasAgenda } from '../consultas-agenda.model';
import { ConsultasAgendaService } from '../service/consultas-agenda.service';

@Component({
  templateUrl: './consultas-agenda-delete-dialog.component.html',
})
export class ConsultasAgendaDeleteDialogComponent {
  consultasAgenda?: IConsultasAgenda;

  constructor(protected consultasAgendaService: ConsultasAgendaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.consultasAgendaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
