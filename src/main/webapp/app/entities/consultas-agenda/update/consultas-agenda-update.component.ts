import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IConsultasAgenda, ConsultasAgenda } from '../consultas-agenda.model';
import { ConsultasAgendaService } from '../service/consultas-agenda.service';
import { IUsuariosSaude } from 'app/entities/usuarios-saude/usuarios-saude.model';
import { UsuariosSaudeService } from 'app/entities/usuarios-saude/service/usuarios-saude.service';
import { ISetorSaude } from 'app/entities/setor-saude/setor-saude.model';
import { SetorSaudeService } from 'app/entities/setor-saude/service/setor-saude.service';
import { IEntidadeSaude } from 'app/entities/entidade-saude/entidade-saude.model';
import { EntidadeSaudeService } from 'app/entities/entidade-saude/service/entidade-saude.service';

@Component({
  selector: 'jhi-consultas-agenda-update',
  templateUrl: './consultas-agenda-update.component.html',
})
export class ConsultasAgendaUpdateComponent implements OnInit {
  isSaving = false;

  usuariosSaudesCollection: IUsuariosSaude[] = [];
  setorSaudesCollection: ISetorSaude[] = [];
  entidadeSaudesCollection: IEntidadeSaude[] = [];

  editForm = this.fb.group({
    id: [],
    agendamentoData: [null, [Validators.required]],
    usuariosSaude: [],
    setorSaude: [],
    entidadeSaude: [],
  });

  constructor(
    protected consultasAgendaService: ConsultasAgendaService,
    protected usuariosSaudeService: UsuariosSaudeService,
    protected setorSaudeService: SetorSaudeService,
    protected entidadeSaudeService: EntidadeSaudeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consultasAgenda }) => {
      if (consultasAgenda.id === undefined) {
        const today = dayjs().startOf('day');
        consultasAgenda.agendamentoData = today;
      }

      this.updateForm(consultasAgenda);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const consultasAgenda = this.createFromForm();
    if (consultasAgenda.id !== undefined) {
      this.subscribeToSaveResponse(this.consultasAgendaService.update(consultasAgenda));
    } else {
      this.subscribeToSaveResponse(this.consultasAgendaService.create(consultasAgenda));
    }
  }

  trackUsuariosSaudeById(index: number, item: IUsuariosSaude): string {
    return item.id!;
  }

  trackSetorSaudeById(index: number, item: ISetorSaude): string {
    return item.id!;
  }

  trackEntidadeSaudeById(index: number, item: IEntidadeSaude): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsultasAgenda>>): void {
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

  protected updateForm(consultasAgenda: IConsultasAgenda): void {
    this.editForm.patchValue({
      id: consultasAgenda.id,
      agendamentoData: consultasAgenda.agendamentoData ? consultasAgenda.agendamentoData.format(DATE_TIME_FORMAT) : null,
      usuariosSaude: consultasAgenda.usuariosSaude,
      setorSaude: consultasAgenda.setorSaude,
      entidadeSaude: consultasAgenda.entidadeSaude,
    });

    this.usuariosSaudesCollection = this.usuariosSaudeService.addUsuariosSaudeToCollectionIfMissing(
      this.usuariosSaudesCollection,
      consultasAgenda.usuariosSaude
    );
    this.setorSaudesCollection = this.setorSaudeService.addSetorSaudeToCollectionIfMissing(
      this.setorSaudesCollection,
      consultasAgenda.setorSaude
    );
    this.entidadeSaudesCollection = this.entidadeSaudeService.addEntidadeSaudeToCollectionIfMissing(
      this.entidadeSaudesCollection,
      consultasAgenda.entidadeSaude
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuariosSaudeService
      .query({ filter: 'consultasagenda-is-null' })
      .pipe(map((res: HttpResponse<IUsuariosSaude[]>) => res.body ?? []))
      .pipe(
        map((usuariosSaudes: IUsuariosSaude[]) =>
          this.usuariosSaudeService.addUsuariosSaudeToCollectionIfMissing(usuariosSaudes, this.editForm.get('usuariosSaude')!.value)
        )
      )
      .subscribe((usuariosSaudes: IUsuariosSaude[]) => (this.usuariosSaudesCollection = usuariosSaudes));

    this.setorSaudeService
      .query({ filter: 'consultasagenda-is-null' })
      .pipe(map((res: HttpResponse<ISetorSaude[]>) => res.body ?? []))
      .pipe(
        map((setorSaudes: ISetorSaude[]) =>
          this.setorSaudeService.addSetorSaudeToCollectionIfMissing(setorSaudes, this.editForm.get('setorSaude')!.value)
        )
      )
      .subscribe((setorSaudes: ISetorSaude[]) => (this.setorSaudesCollection = setorSaudes));

    this.entidadeSaudeService
      .query({ filter: 'consultasagenda-is-null' })
      .pipe(map((res: HttpResponse<IEntidadeSaude[]>) => res.body ?? []))
      .pipe(
        map((entidadeSaudes: IEntidadeSaude[]) =>
          this.entidadeSaudeService.addEntidadeSaudeToCollectionIfMissing(entidadeSaudes, this.editForm.get('entidadeSaude')!.value)
        )
      )
      .subscribe((entidadeSaudes: IEntidadeSaude[]) => (this.entidadeSaudesCollection = entidadeSaudes));
  }

  protected createFromForm(): IConsultasAgenda {
    return {
      ...new ConsultasAgenda(),
      id: this.editForm.get(['id'])!.value,
      agendamentoData: this.editForm.get(['agendamentoData'])!.value
        ? dayjs(this.editForm.get(['agendamentoData'])!.value, DATE_TIME_FORMAT)
        : undefined,
      usuariosSaude: this.editForm.get(['usuariosSaude'])!.value,
      setorSaude: this.editForm.get(['setorSaude'])!.value,
      entidadeSaude: this.editForm.get(['entidadeSaude'])!.value,
    };
  }
}
