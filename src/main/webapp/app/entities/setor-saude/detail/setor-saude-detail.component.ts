import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISetorSaude } from '../setor-saude.model';

@Component({
  selector: 'jhi-setor-saude-detail',
  templateUrl: './setor-saude-detail.component.html',
})
export class SetorSaudeDetailComponent implements OnInit {
  setorSaude: ISetorSaude | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ setorSaude }) => {
      this.setorSaude = setorSaude;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
