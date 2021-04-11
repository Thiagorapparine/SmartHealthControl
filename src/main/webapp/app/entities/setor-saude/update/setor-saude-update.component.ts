import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISetorSaude, SetorSaude } from '../setor-saude.model';
import { SetorSaudeService } from '../service/setor-saude.service';

@Component({
  selector: 'jhi-setor-saude-update',
  templateUrl: './setor-saude-update.component.html',
})
export class SetorSaudeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    setorSaude: [null, [Validators.required]],
  });

  constructor(protected setorSaudeService: SetorSaudeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ setorSaude }) => {
      this.updateForm(setorSaude);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const setorSaude = this.createFromForm();
    if (setorSaude.id !== undefined) {
      this.subscribeToSaveResponse(this.setorSaudeService.update(setorSaude));
    } else {
      this.subscribeToSaveResponse(this.setorSaudeService.create(setorSaude));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISetorSaude>>): void {
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

  protected updateForm(setorSaude: ISetorSaude): void {
    this.editForm.patchValue({
      id: setorSaude.id,
      setorSaude: setorSaude.setorSaude,
    });
  }

  protected createFromForm(): ISetorSaude {
    return {
      ...new SetorSaude(),
      id: this.editForm.get(['id'])!.value,
      setorSaude: this.editForm.get(['setorSaude'])!.value,
    };
  }
}
