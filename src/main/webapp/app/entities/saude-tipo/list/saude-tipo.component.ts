import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISaudeTipo } from '../saude-tipo.model';
import { SaudeTipoService } from '../service/saude-tipo.service';
import { SaudeTipoDeleteDialogComponent } from '../delete/saude-tipo-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-saude-tipo',
  templateUrl: './saude-tipo.component.html',
})
export class SaudeTipoComponent implements OnInit {
  saudeTipos?: ISaudeTipo[];
  isLoading = false;

  constructor(protected saudeTipoService: SaudeTipoService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.saudeTipoService.query().subscribe(
      (res: HttpResponse<ISaudeTipo[]>) => {
        this.isLoading = false;
        this.saudeTipos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISaudeTipo): string {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(saudeTipo: ISaudeTipo): void {
    const modalRef = this.modalService.open(SaudeTipoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.saudeTipo = saudeTipo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
