import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISaudeTipo } from '../saude-tipo.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-saude-tipo-detail',
  templateUrl: './saude-tipo-detail.component.html',
})
export class SaudeTipoDetailComponent implements OnInit {
  saudeTipo: ISaudeTipo | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ saudeTipo }) => {
      this.saudeTipo = saudeTipo;
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
