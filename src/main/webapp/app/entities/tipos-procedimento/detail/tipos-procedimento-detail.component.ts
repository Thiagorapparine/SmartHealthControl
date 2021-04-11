import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITiposProcedimento } from '../tipos-procedimento.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-tipos-procedimento-detail',
  templateUrl: './tipos-procedimento-detail.component.html',
})
export class TiposProcedimentoDetailComponent implements OnInit {
  tiposProcedimento: ITiposProcedimento | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tiposProcedimento }) => {
      this.tiposProcedimento = tiposProcedimento;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
