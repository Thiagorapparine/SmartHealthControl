import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsuariosSaude } from '../usuarios-saude.model';
import { UsuariosSaudeService } from '../service/usuarios-saude.service';
import { UsuariosSaudeDeleteDialogComponent } from '../delete/usuarios-saude-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-usuarios-saude',
  templateUrl: './usuarios-saude.component.html',
})
export class UsuariosSaudeComponent implements OnInit {
  usuariosSaudes?: IUsuariosSaude[];
  isLoading = false;

  constructor(protected usuariosSaudeService: UsuariosSaudeService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.usuariosSaudeService.query().subscribe(
      (res: HttpResponse<IUsuariosSaude[]>) => {
        this.isLoading = false;
        this.usuariosSaudes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUsuariosSaude): string {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(usuariosSaude: IUsuariosSaude): void {
    const modalRef = this.modalService.open(UsuariosSaudeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.usuariosSaude = usuariosSaude;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
