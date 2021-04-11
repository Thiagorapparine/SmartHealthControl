import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfissionais } from '../profissionais.model';
import { ProfissionaisService } from '../service/profissionais.service';
import { ProfissionaisDeleteDialogComponent } from '../delete/profissionais-delete-dialog.component';

@Component({
  selector: 'jhi-profissionais',
  templateUrl: './profissionais.component.html',
})
export class ProfissionaisComponent implements OnInit {
  profissionais?: IProfissionais[];
  isLoading = false;

  constructor(protected profissionaisService: ProfissionaisService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.profissionaisService.query().subscribe(
      (res: HttpResponse<IProfissionais[]>) => {
        this.isLoading = false;
        this.profissionais = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProfissionais): string {
    return item.id!;
  }

  delete(profissionais: IProfissionais): void {
    const modalRef = this.modalService.open(ProfissionaisDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.profissionais = profissionais;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
