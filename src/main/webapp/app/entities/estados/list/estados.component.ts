import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstados } from '../estados.model';
import { EstadosService } from '../service/estados.service';
import { EstadosDeleteDialogComponent } from '../delete/estados-delete-dialog.component';

@Component({
  selector: 'jhi-estados',
  templateUrl: './estados.component.html',
})
export class EstadosComponent implements OnInit {
  estados?: IEstados[];
  isLoading = false;

  constructor(protected estadosService: EstadosService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.estadosService.query().subscribe(
      (res: HttpResponse<IEstados[]>) => {
        this.isLoading = false;
        this.estados = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEstados): string {
    return item.id!;
  }

  delete(estados: IEstados): void {
    const modalRef = this.modalService.open(EstadosDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.estados = estados;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
