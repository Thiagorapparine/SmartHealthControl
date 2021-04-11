import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITiposProcedimento } from '../tipos-procedimento.model';
import { TiposProcedimentoService } from '../service/tipos-procedimento.service';
import { TiposProcedimentoDeleteDialogComponent } from '../delete/tipos-procedimento-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-tipos-procedimento',
  templateUrl: './tipos-procedimento.component.html',
})
export class TiposProcedimentoComponent implements OnInit {
  tiposProcedimentos?: ITiposProcedimento[];
  isLoading = false;

  constructor(
    protected tiposProcedimentoService: TiposProcedimentoService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.tiposProcedimentoService.query().subscribe(
      (res: HttpResponse<ITiposProcedimento[]>) => {
        this.isLoading = false;
        this.tiposProcedimentos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITiposProcedimento): string {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(tiposProcedimento: ITiposProcedimento): void {
    const modalRef = this.modalService.open(TiposProcedimentoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tiposProcedimento = tiposProcedimento;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
