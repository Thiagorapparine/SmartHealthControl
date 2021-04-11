import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITiposProcedimento, TiposProcedimento } from '../tipos-procedimento.model';
import { TiposProcedimentoService } from '../service/tipos-procedimento.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ISetorSaude } from 'app/entities/setor-saude/setor-saude.model';
import { SetorSaudeService } from 'app/entities/setor-saude/service/setor-saude.service';

@Component({
  selector: 'jhi-tipos-procedimento-update',
  templateUrl: './tipos-procedimento-update.component.html',
})
export class TiposProcedimentoUpdateComponent implements OnInit {
  isSaving = false;

  setorSaudesCollection: ISetorSaude[] = [];

  editForm = this.fb.group({
    id: [],
    procedimentoNome: [null, [Validators.required]],
    procedimentoDescricao: [],
    setorSaude: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected tiposProcedimentoService: TiposProcedimentoService,
    protected setorSaudeService: SetorSaudeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tiposProcedimento }) => {
      this.updateForm(tiposProcedimento);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('tccSmartHealthControlApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tiposProcedimento = this.createFromForm();
    if (tiposProcedimento.id !== undefined) {
      this.subscribeToSaveResponse(this.tiposProcedimentoService.update(tiposProcedimento));
    } else {
      this.subscribeToSaveResponse(this.tiposProcedimentoService.create(tiposProcedimento));
    }
  }

  trackSetorSaudeById(index: number, item: ISetorSaude): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITiposProcedimento>>): void {
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

  protected updateForm(tiposProcedimento: ITiposProcedimento): void {
    this.editForm.patchValue({
      id: tiposProcedimento.id,
      procedimentoNome: tiposProcedimento.procedimentoNome,
      procedimentoDescricao: tiposProcedimento.procedimentoDescricao,
      setorSaude: tiposProcedimento.setorSaude,
    });

    this.setorSaudesCollection = this.setorSaudeService.addSetorSaudeToCollectionIfMissing(
      this.setorSaudesCollection,
      tiposProcedimento.setorSaude
    );
  }

  protected loadRelationshipsOptions(): void {
    this.setorSaudeService
      .query({ filter: 'tiposprocedimento-is-null' })
      .pipe(map((res: HttpResponse<ISetorSaude[]>) => res.body ?? []))
      .pipe(
        map((setorSaudes: ISetorSaude[]) =>
          this.setorSaudeService.addSetorSaudeToCollectionIfMissing(setorSaudes, this.editForm.get('setorSaude')!.value)
        )
      )
      .subscribe((setorSaudes: ISetorSaude[]) => (this.setorSaudesCollection = setorSaudes));
  }

  protected createFromForm(): ITiposProcedimento {
    return {
      ...new TiposProcedimento(),
      id: this.editForm.get(['id'])!.value,
      procedimentoNome: this.editForm.get(['procedimentoNome'])!.value,
      procedimentoDescricao: this.editForm.get(['procedimentoDescricao'])!.value,
      setorSaude: this.editForm.get(['setorSaude'])!.value,
    };
  }
}
