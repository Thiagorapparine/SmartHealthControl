import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProfissionais } from '../profissionais.model';

@Component({
  selector: 'jhi-profissionais-detail',
  templateUrl: './profissionais-detail.component.html',
})
export class ProfissionaisDetailComponent implements OnInit {
  profissionais: IProfissionais | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profissionais }) => {
      this.profissionais = profissionais;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
