import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IExamesAgenda, ExamesAgenda } from '../exames-agenda.model';
import { ExamesAgendaService } from '../service/exames-agenda.service';
import { ITiposProcedimento } from 'app/entities/tipos-procedimento/tipos-procedimento.model';
import { TiposProcedimentoService } from 'app/entities/tipos-procedimento/service/tipos-procedimento.service';
import { IEntidadeSaude } from 'app/entities/entidade-saude/entidade-saude.model';
import { EntidadeSaudeService } from 'app/entities/entidade-saude/service/entidade-saude.service';

@Component({
  selector: 'jhi-exames-agenda-update',
  templateUrl: './exames-agenda-update.component.html',
})
export class ExamesAgendaUpdateComponent implements OnInit {
  isSaving = false;

  tiposProcedimentosCollection: ITiposProcedimento[] = [];
  entidadeSaudesCollection: IEntidadeSaude[] = [];

  editForm = this.fb.group({
    id: [],
    agendamentoData: [null, [Validators.required]],
    tiposProcedimento: [],
    entidadeSaude: [],
  });

  constructor(
    protected examesAgendaService: ExamesAgendaService,
    protected tiposProcedimentoService: TiposProcedimentoService,
    protected entidadeSaudeService: EntidadeSaudeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ examesAgenda }) => {
      if (examesAgenda.id === undefined) {
        const today = dayjs().startOf('day');
        examesAgenda.agendamentoData = today;
      }

      this.updateForm(examesAgenda);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const examesAgenda = this.createFromForm();
    if (examesAgenda.id !== undefined) {
      this.subscribeToSaveResponse(this.examesAgendaService.update(examesAgenda));
    } else {
      this.subscribeToSaveResponse(this.examesAgendaService.create(examesAgenda));
    }
  }

  trackTiposProcedimentoById(index: number, item: ITiposProcedimento): string {
    return item.id!;
  }

  trackEntidadeSaudeById(index: number, item: IEntidadeSaude): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExamesAgenda>>): void {
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

  protected updateForm(examesAgenda: IExamesAgenda): void {
    this.editForm.patchValue({
      id: examesAgenda.id,
      agendamentoData: examesAgenda.agendamentoData ? examesAgenda.agendamentoData.format(DATE_TIME_FORMAT) : null,
      tiposProcedimento: examesAgenda.tiposProcedimento,
      entidadeSaude: examesAgenda.entidadeSaude,
    });

    this.tiposProcedimentosCollection = this.tiposProcedimentoService.addTiposProcedimentoToCollectionIfMissing(
      this.tiposProcedimentosCollection,
      examesAgenda.tiposProcedimento
    );
    this.entidadeSaudesCollection = this.entidadeSaudeService.addEntidadeSaudeToCollectionIfMissing(
      this.entidadeSaudesCollection,
      examesAgenda.entidadeSaude
    );
  }

  protected loadRelationshipsOptions(): void {
    this.tiposProcedimentoService
      .query({ filter: 'examesagenda-is-null' })
      .pipe(map((res: HttpResponse<ITiposProcedimento[]>) => res.body ?? []))
      .pipe(
        map((tiposProcedimentos: ITiposProcedimento[]) =>
          this.tiposProcedimentoService.addTiposProcedimentoToCollectionIfMissing(
            tiposProcedimentos,
            this.editForm.get('tiposProcedimento')!.value
          )
        )
      )
      .subscribe((tiposProcedimentos: ITiposProcedimento[]) => (this.tiposProcedimentosCollection = tiposProcedimentos));

    this.entidadeSaudeService
      .query({ filter: 'examesagenda-is-null' })
      .pipe(map((res: HttpResponse<IEntidadeSaude[]>) => res.body ?? []))
      .pipe(
        map((entidadeSaudes: IEntidadeSaude[]) =>
          this.entidadeSaudeService.addEntidadeSaudeToCollectionIfMissing(entidadeSaudes, this.editForm.get('entidadeSaude')!.value)
        )
      )
      .subscribe((entidadeSaudes: IEntidadeSaude[]) => (this.entidadeSaudesCollection = entidadeSaudes));
  }

  protected createFromForm(): IExamesAgenda {
    return {
      ...new ExamesAgenda(),
      id: this.editForm.get(['id'])!.value,
      agendamentoData: this.editForm.get(['agendamentoData'])!.value
        ? dayjs(this.editForm.get(['agendamentoData'])!.value, DATE_TIME_FORMAT)
        : undefined,
      tiposProcedimento: this.editForm.get(['tiposProcedimento'])!.value,
      entidadeSaude: this.editForm.get(['entidadeSaude'])!.value,
    };
  }
}
