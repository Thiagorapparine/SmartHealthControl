import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEstados, Estados } from '../estados.model';
import { EstadosService } from '../service/estados.service';

@Component({
  selector: 'jhi-estados-update',
  templateUrl: './estados-update.component.html',
})
export class EstadosUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    estadosNome: [null, [Validators.required]],
    estadosSigla: [null, [Validators.required]],
  });

  constructor(protected estadosService: EstadosService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estados }) => {
      this.updateForm(estados);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estados = this.createFromForm();
    if (estados.id !== undefined) {
      this.subscribeToSaveResponse(this.estadosService.update(estados));
    } else {
      this.subscribeToSaveResponse(this.estadosService.create(estados));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstados>>): void {
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

  protected updateForm(estados: IEstados): void {
    this.editForm.patchValue({
      id: estados.id,
      estadosNome: estados.estadosNome,
      estadosSigla: estados.estadosSigla,
    });
  }

  protected createFromForm(): IEstados {
    return {
      ...new Estados(),
      id: this.editForm.get(['id'])!.value,
      estadosNome: this.editForm.get(['estadosNome'])!.value,
      estadosSigla: this.editForm.get(['estadosSigla'])!.value,
    };
  }
}
