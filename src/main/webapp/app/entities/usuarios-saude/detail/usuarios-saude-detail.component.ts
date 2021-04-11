import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUsuariosSaude } from '../usuarios-saude.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-usuarios-saude-detail',
  templateUrl: './usuarios-saude-detail.component.html',
})
export class UsuariosSaudeDetailComponent implements OnInit {
  usuariosSaude: IUsuariosSaude | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuariosSaude }) => {
      this.usuariosSaude = usuariosSaude;
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
