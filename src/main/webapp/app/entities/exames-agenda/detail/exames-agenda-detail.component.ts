import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExamesAgenda } from '../exames-agenda.model';

@Component({
  selector: 'jhi-exames-agenda-detail',
  templateUrl: './exames-agenda-detail.component.html',
})
export class ExamesAgendaDetailComponent implements OnInit {
  examesAgenda: IExamesAgenda | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ examesAgenda }) => {
      this.examesAgenda = examesAgenda;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
