import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProfissionais, Profissionais } from '../profissionais.model';
import { ProfissionaisService } from '../service/profissionais.service';
import { IEstados } from 'app/entities/estados/estados.model';
import { EstadosService } from 'app/entities/estados/service/estados.service';
import { ISetorSaude } from 'app/entities/setor-saude/setor-saude.model';
import { SetorSaudeService } from 'app/entities/setor-saude/service/setor-saude.service';

@Component({
  selector: 'jhi-profissionais-update',
  templateUrl: './profissionais-update.component.html',
})
export class ProfissionaisUpdateComponent implements OnInit {
  isSaving = false;

  estadosCollection: IEstados[] = [];
  setorSaudesCollection: ISetorSaude[] = [];

  editForm = this.fb.group({
    id: [],
    profissionalNome: [null, [Validators.required]],
    profissionalHoraInicio: [null, [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')]],
    profissionalHoraFim: [null, [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')]],
    estados: [],
    setorSaude: [],
  });

  constructor(
    protected profissionaisService: ProfissionaisService,
    protected estadosService: EstadosService,
    protected setorSaudeService: SetorSaudeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profissionais }) => {
      this.updateForm(profissionais);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const profissionais = this.createFromForm();
    if (profissionais.id !== undefined) {
      this.subscribeToSaveResponse(this.profissionaisService.update(profissionais));
    } else {
      this.subscribeToSaveResponse(this.profissionaisService.create(profissionais));
    }
  }

  trackEstadosById(index: number, item: IEstados): string {
    return item.id!;
  }

  trackSetorSaudeById(index: number, item: ISetorSaude): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfissionais>>): void {
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

  protected updateForm(profissionais: IProfissionais): void {
    this.editForm.patchValue({
      id: profissionais.id,
      profissionalNome: profissionais.profissionalNome,
      profissionalHoraInicio: profissionais.profissionalHoraInicio,
      profissionalHoraFim: profissionais.profissionalHoraFim,
      estados: profissionais.estados,
      setorSaude: profissionais.setorSaude,
    });

    this.estadosCollection = this.estadosService.addEstadosToCollectionIfMissing(this.estadosCollection, profissionais.estados);
    this.setorSaudesCollection = this.setorSaudeService.addSetorSaudeToCollectionIfMissing(
      this.setorSaudesCollection,
      profissionais.setorSaude
    );
  }

  protected loadRelationshipsOptions(): void {
    this.estadosService
      .query({ filter: 'profissionais-is-null' })
      .pipe(map((res: HttpResponse<IEstados[]>) => res.body ?? []))
      .pipe(map((estados: IEstados[]) => this.estadosService.addEstadosToCollectionIfMissing(estados, this.editForm.get('estados')!.value)))
      .subscribe((estados: IEstados[]) => (this.estadosCollection = estados));

    this.setorSaudeService
      .query({ filter: 'profissionais-is-null' })
      .pipe(map((res: HttpResponse<ISetorSaude[]>) => res.body ?? []))
      .pipe(
        map((setorSaudes: ISetorSaude[]) =>
          this.setorSaudeService.addSetorSaudeToCollectionIfMissing(setorSaudes, this.editForm.get('setorSaude')!.value)
        )
      )
      .subscribe((setorSaudes: ISetorSaude[]) => (this.setorSaudesCollection = setorSaudes));
  }

  protected createFromForm(): IProfissionais {
    return {
      ...new Profissionais(),
      id: this.editForm.get(['id'])!.value,
      profissionalNome: this.editForm.get(['profissionalNome'])!.value,
      profissionalHoraInicio: this.editForm.get(['profissionalHoraInicio'])!.value,
      profissionalHoraFim: this.editForm.get(['profissionalHoraFim'])!.value,
      estados: this.editForm.get(['estados'])!.value,
      setorSaude: this.editForm.get(['setorSaude'])!.value,
    };
  }
}
