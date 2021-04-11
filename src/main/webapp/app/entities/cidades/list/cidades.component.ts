import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICidades } from '../cidades.model';
import { CidadesService } from '../service/cidades.service';
import { CidadesDeleteDialogComponent } from '../delete/cidades-delete-dialog.component';

@Component({
  selector: 'jhi-cidades',
  templateUrl: './cidades.component.html',
})
export class CidadesComponent implements OnInit {
  cidades?: ICidades[];
  isLoading = false;

  constructor(protected cidadesService: CidadesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.cidadesService.query().subscribe(
      (res: HttpResponse<ICidades[]>) => {
        this.isLoading = false;
        this.cidades = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICidades): string {
    return item.id!;
  }

  delete(cidades: ICidades): void {
    const modalRef = this.modalService.open(CidadesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cidades = cidades;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
