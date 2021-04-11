import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEntidadeSaude } from '../entidade-saude.model';

@Component({
  selector: 'jhi-entidade-saude-detail',
  templateUrl: './entidade-saude-detail.component.html',
})
export class EntidadeSaudeDetailComponent implements OnInit {
  entidadeSaude: IEntidadeSaude | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entidadeSaude }) => {
      this.entidadeSaude = entidadeSaude;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
