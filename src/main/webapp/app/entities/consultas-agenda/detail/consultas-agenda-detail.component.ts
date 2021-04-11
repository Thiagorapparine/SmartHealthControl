import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConsultasAgenda } from '../consultas-agenda.model';

@Component({
  selector: 'jhi-consultas-agenda-detail',
  templateUrl: './consultas-agenda-detail.component.html',
})
export class ConsultasAgendaDetailComponent implements OnInit {
  consultasAgenda: IConsultasAgenda | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consultasAgenda }) => {
      this.consultasAgenda = consultasAgenda;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
