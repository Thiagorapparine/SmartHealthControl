import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISetorSaude } from '../setor-saude.model';
import { SetorSaudeService } from '../service/setor-saude.service';
import { SetorSaudeDeleteDialogComponent } from '../delete/setor-saude-delete-dialog.component';

@Component({
  selector: 'jhi-setor-saude',
  templateUrl: './setor-saude.component.html',
})
export class SetorSaudeComponent implements OnInit {
  setorSaudes?: ISetorSaude[];
  isLoading = false;

  constructor(protected setorSaudeService: SetorSaudeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.setorSaudeService.query().subscribe(
      (res: HttpResponse<ISetorSaude[]>) => {
        this.isLoading = false;
        this.setorSaudes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISetorSaude): string {
    return item.id!;
  }

  delete(setorSaude: ISetorSaude): void {
    const modalRef = this.modalService.open(SetorSaudeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.setorSaude = setorSaude;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
