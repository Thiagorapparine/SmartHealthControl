import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEstados } from '../estados.model';

@Component({
  selector: 'jhi-estados-detail',
  templateUrl: './estados-detail.component.html',
})
export class EstadosDetailComponent implements OnInit {
  estados: IEstados | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estados }) => {
      this.estados = estados;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
