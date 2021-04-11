import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEntidadeSaude } from '../entidade-saude.model';
import { EntidadeSaudeService } from '../service/entidade-saude.service';
import { EntidadeSaudeDeleteDialogComponent } from '../delete/entidade-saude-delete-dialog.component';

@Component({
  selector: 'jhi-entidade-saude',
  templateUrl: './entidade-saude.component.html',
})
export class EntidadeSaudeComponent implements OnInit {
  entidadeSaudes?: IEntidadeSaude[];
  isLoading = false;

  constructor(protected entidadeSaudeService: EntidadeSaudeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.entidadeSaudeService.query().subscribe(
      (res: HttpResponse<IEntidadeSaude[]>) => {
        this.isLoading = false;
        this.entidadeSaudes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEntidadeSaude): string {
    return item.id!;
  }

  delete(entidadeSaude: IEntidadeSaude): void {
    const modalRef = this.modalService.open(EntidadeSaudeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.entidadeSaude = entidadeSaude;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
