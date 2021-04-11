import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEntidadeSaude, EntidadeSaude } from '../entidade-saude.model';
import { EntidadeSaudeService } from '../service/entidade-saude.service';
import { ISaudeTipo } from 'app/entities/saude-tipo/saude-tipo.model';
import { SaudeTipoService } from 'app/entities/saude-tipo/service/saude-tipo.service';
import { IEstados } from 'app/entities/estados/estados.model';
import { EstadosService } from 'app/entities/estados/service/estados.service';
import { ICidades } from 'app/entities/cidades/cidades.model';
import { CidadesService } from 'app/entities/cidades/service/cidades.service';
import { ITiposProcedimento } from 'app/entities/tipos-procedimento/tipos-procedimento.model';
import { TiposProcedimentoService } from 'app/entities/tipos-procedimento/service/tipos-procedimento.service';
import { IProfissionais } from 'app/entities/profissionais/profissionais.model';
import { ProfissionaisService } from 'app/entities/profissionais/service/profissionais.service';

@Component({
  selector: 'jhi-entidade-saude-update',
  templateUrl: './entidade-saude-update.component.html',
})
export class EntidadeSaudeUpdateComponent implements OnInit {
  isSaving = false;

  saudeTiposCollection: ISaudeTipo[] = [];
  estadosCollection: IEstados[] = [];
  cidadesCollection: ICidades[] = [];
  tiposProcedimentosSharedCollection: ITiposProcedimento[] = [];
  profissionaisSharedCollection: IProfissionais[] = [];

  editForm = this.fb.group({
    id: [],
    entidadeNome: [null, [Validators.required]],
    entidadeSetor: [null, [Validators.required]],
    entidadeEndereco: [null, [Validators.required]],
    saudeTipo: [],
    estados: [],
    cidades: [],
    tiposProcedimentos: [],
    profissionais: [],
  });

  constructor(
    protected entidadeSaudeService: EntidadeSaudeService,
    protected saudeTipoService: SaudeTipoService,
    protected estadosService: EstadosService,
    protected cidadesService: CidadesService,
    protected tiposProcedimentoService: TiposProcedimentoService,
    protected profissionaisService: ProfissionaisService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entidadeSaude }) => {
      this.updateForm(entidadeSaude);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const entidadeSaude = this.createFromForm();
    if (entidadeSaude.id !== undefined) {
      this.subscribeToSaveResponse(this.entidadeSaudeService.update(entidadeSaude));
    } else {
      this.subscribeToSaveResponse(this.entidadeSaudeService.create(entidadeSaude));
    }
  }

  trackSaudeTipoById(index: number, item: ISaudeTipo): string {
    return item.id!;
  }

  trackEstadosById(index: number, item: IEstados): string {
    return item.id!;
  }

  trackCidadesById(index: number, item: ICidades): string {
    return item.id!;
  }

  trackTiposProcedimentoById(index: number, item: ITiposProcedimento): string {
    return item.id!;
  }

  trackProfissionaisById(index: number, item: IProfissionais): string {
    return item.id!;
  }

  getSelectedTiposProcedimento(option: ITiposProcedimento, selectedVals?: ITiposProcedimento[]): ITiposProcedimento {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedProfissionais(option: IProfissionais, selectedVals?: IProfissionais[]): IProfissionais {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEntidadeSaude>>): void {
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

  protected updateForm(entidadeSaude: IEntidadeSaude): void {
    this.editForm.patchValue({
      id: entidadeSaude.id,
      entidadeNome: entidadeSaude.entidadeNome,
      entidadeSetor: entidadeSaude.entidadeSetor,
      entidadeEndereco: entidadeSaude.entidadeEndereco,
      saudeTipo: entidadeSaude.saudeTipo,
      estados: entidadeSaude.estados,
      cidades: entidadeSaude.cidades,
      tiposProcedimentos: entidadeSaude.tiposProcedimentos,
      profissionais: entidadeSaude.profissionais,
    });

    this.saudeTiposCollection = this.saudeTipoService.addSaudeTipoToCollectionIfMissing(this.saudeTiposCollection, entidadeSaude.saudeTipo);
    this.estadosCollection = this.estadosService.addEstadosToCollectionIfMissing(this.estadosCollection, entidadeSaude.estados);
    this.cidadesCollection = this.cidadesService.addCidadesToCollectionIfMissing(this.cidadesCollection, entidadeSaude.cidades);
    this.tiposProcedimentosSharedCollection = this.tiposProcedimentoService.addTiposProcedimentoToCollectionIfMissing(
      this.tiposProcedimentosSharedCollection,
      ...(entidadeSaude.tiposProcedimentos ?? [])
    );
    this.profissionaisSharedCollection = this.profissionaisService.addProfissionaisToCollectionIfMissing(
      this.profissionaisSharedCollection,
      ...(entidadeSaude.profissionais ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.saudeTipoService
      .query({ filter: 'entidadesaude-is-null' })
      .pipe(map((res: HttpResponse<ISaudeTipo[]>) => res.body ?? []))
      .pipe(
        map((saudeTipos: ISaudeTipo[]) =>
          this.saudeTipoService.addSaudeTipoToCollectionIfMissing(saudeTipos, this.editForm.get('saudeTipo')!.value)
        )
      )
      .subscribe((saudeTipos: ISaudeTipo[]) => (this.saudeTiposCollection = saudeTipos));

    this.estadosService
      .query({ filter: 'entidadesaude-is-null' })
      .pipe(map((res: HttpResponse<IEstados[]>) => res.body ?? []))
      .pipe(map((estados: IEstados[]) => this.estadosService.addEstadosToCollectionIfMissing(estados, this.editForm.get('estados')!.value)))
      .subscribe((estados: IEstados[]) => (this.estadosCollection = estados));

    this.cidadesService
      .query({ filter: 'entidadesaude-is-null' })
      .pipe(map((res: HttpResponse<ICidades[]>) => res.body ?? []))
      .pipe(map((cidades: ICidades[]) => this.cidadesService.addCidadesToCollectionIfMissing(cidades, this.editForm.get('cidades')!.value)))
      .subscribe((cidades: ICidades[]) => (this.cidadesCollection = cidades));

    this.tiposProcedimentoService
      .query()
      .pipe(map((res: HttpResponse<ITiposProcedimento[]>) => res.body ?? []))
      .pipe(
        map((tiposProcedimentos: ITiposProcedimento[]) =>
          this.tiposProcedimentoService.addTiposProcedimentoToCollectionIfMissing(
            tiposProcedimentos,
            ...(this.editForm.get('tiposProcedimentos')!.value ?? [])
          )
        )
      )
      .subscribe((tiposProcedimentos: ITiposProcedimento[]) => (this.tiposProcedimentosSharedCollection = tiposProcedimentos));

    this.profissionaisService
      .query()
      .pipe(map((res: HttpResponse<IProfissionais[]>) => res.body ?? []))
      .pipe(
        map((profissionais: IProfissionais[]) =>
          this.profissionaisService.addProfissionaisToCollectionIfMissing(
            profissionais,
            ...(this.editForm.get('profissionais')!.value ?? [])
          )
        )
      )
      .subscribe((profissionais: IProfissionais[]) => (this.profissionaisSharedCollection = profissionais));
  }

  protected createFromForm(): IEntidadeSaude {
    return {
      ...new EntidadeSaude(),
      id: this.editForm.get(['id'])!.value,
      entidadeNome: this.editForm.get(['entidadeNome'])!.value,
      entidadeSetor: this.editForm.get(['entidadeSetor'])!.value,
      entidadeEndereco: this.editForm.get(['entidadeEndereco'])!.value,
      saudeTipo: this.editForm.get(['saudeTipo'])!.value,
      estados: this.editForm.get(['estados'])!.value,
      cidades: this.editForm.get(['cidades'])!.value,
      tiposProcedimentos: this.editForm.get(['tiposProcedimentos'])!.value,
      profissionais: this.editForm.get(['profissionais'])!.value,
    };
  }
}
