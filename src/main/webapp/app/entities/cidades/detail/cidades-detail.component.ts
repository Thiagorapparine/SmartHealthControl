import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICidades } from '../cidades.model';

@Component({
  selector: 'jhi-cidades-detail',
  templateUrl: './cidades-detail.component.html',
})
export class CidadesDetailComponent implements OnInit {
  cidades: ICidades | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cidades }) => {
      this.cidades = cidades;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
