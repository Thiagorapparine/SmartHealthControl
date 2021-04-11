import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICidades, Cidades } from '../cidades.model';
import { CidadesService } from '../service/cidades.service';
import { IEstados } from 'app/entities/estados/estados.model';
import { EstadosService } from 'app/entities/estados/service/estados.service';

@Component({
  selector: 'jhi-cidades-update',
  templateUrl: './cidades-update.component.html',
})
export class CidadesUpdateComponent implements OnInit {
  isSaving = false;

  estadosCollection: IEstados[] = [];

  editForm = this.fb.group({
    id: [],
    cidadeNome: [null, [Validators.required]],
    estados: [],
  });

  constructor(
    protected cidadesService: CidadesService,
    protected estadosService: EstadosService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cidades }) => {
      this.updateForm(cidades);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cidades = this.createFromForm();
    if (cidades.id !== undefined) {
      this.subscribeToSaveResponse(this.cidadesService.update(cidades));
    } else {
      this.subscribeToSaveResponse(this.cidadesService.create(cidades));
    }
  }

  trackEstadosById(index: number, item: IEstados): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICidades>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(cidades: ICidades): void {
    this.editForm.patchValue({
      id: cidades.id,
      cidadeNome: cidades.cidadeNome,
      estados: cidades.estados,
    });

    this.estadosCollection = this.estadosService.addEstadosToCollectionIfMissing(this.estadosCollection, cidades.estados);
  }

  protected loadRelationshipsOptions(): void {
    this.estadosService
      .query({ filter: 'cidades-is-null' })
      .pipe(map((res: HttpResponse<IEstados[]>) => res.body ?? []))
      .pipe(map((estados: IEstados[]) => this.estadosService.addEstadosToCollectionIfMissing(estados, this.editForm.get('estados')!.value)))
      .subscribe((estados: IEstados[]) => (this.estadosCollection = estados));
  }

  protected createFromForm(): ICidades {
    return {
      ...new Cidades(),
      id: this.editForm.get(['id'])!.value,
      cidadeNome: this.editForm.get(['cidadeNome'])!.value,
      estados: this.editForm.get(['estados'])!.value,
    };
  }
}
