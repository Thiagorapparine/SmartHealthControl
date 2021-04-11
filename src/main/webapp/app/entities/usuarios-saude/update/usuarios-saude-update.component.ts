import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUsuariosSaude, UsuariosSaude } from '../usuarios-saude.model';
import { UsuariosSaudeService } from '../service/usuarios-saude.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICidades } from 'app/entities/cidades/cidades.model';
import { CidadesService } from 'app/entities/cidades/service/cidades.service';

@Component({
  selector: 'jhi-usuarios-saude-update',
  templateUrl: './usuarios-saude-update.component.html',
})
export class UsuariosSaudeUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  cidadesCollection: ICidades[] = [];

  editForm = this.fb.group({
    id: [],
    usuarioFoto: [],
    usuarioFotoContentType: [],
    usuarioNome: [null, [Validators.required]],
    usuarioCPF: [null, [Validators.required, Validators.pattern('[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}\\-?[0-9]{2}')]],
    usuarioDataNascimento: [null, [Validators.required, Validators.pattern('[0-9]{2}[-|\\/]{1}[0-9]{2}[-|\\/]{1}[0-9]{4}')]],
    user: [],
    cidades: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected usuariosSaudeService: UsuariosSaudeService,
    protected userService: UserService,
    protected cidadesService: CidadesService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuariosSaude }) => {
      this.updateForm(usuariosSaude);

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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuariosSaude = this.createFromForm();
    if (usuariosSaude.id !== undefined) {
      this.subscribeToSaveResponse(this.usuariosSaudeService.update(usuariosSaude));
    } else {
      this.subscribeToSaveResponse(this.usuariosSaudeService.create(usuariosSaude));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackCidadesById(index: number, item: ICidades): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuariosSaude>>): void {
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

  protected updateForm(usuariosSaude: IUsuariosSaude): void {
    this.editForm.patchValue({
      id: usuariosSaude.id,
      usuarioFoto: usuariosSaude.usuarioFoto,
      usuarioFotoContentType: usuariosSaude.usuarioFotoContentType,
      usuarioNome: usuariosSaude.usuarioNome,
      usuarioCPF: usuariosSaude.usuarioCPF,
      usuarioDataNascimento: usuariosSaude.usuarioDataNascimento,
      user: usuariosSaude.user,
      cidades: usuariosSaude.cidades,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, usuariosSaude.user);
    this.cidadesCollection = this.cidadesService.addCidadesToCollectionIfMissing(this.cidadesCollection, usuariosSaude.cidades);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.cidadesService
      .query({ filter: 'usuariossaude-is-null' })
      .pipe(map((res: HttpResponse<ICidades[]>) => res.body ?? []))
      .pipe(map((cidades: ICidades[]) => this.cidadesService.addCidadesToCollectionIfMissing(cidades, this.editForm.get('cidades')!.value)))
      .subscribe((cidades: ICidades[]) => (this.cidadesCollection = cidades));
  }

  protected createFromForm(): IUsuariosSaude {
    return {
      ...new UsuariosSaude(),
      id: this.editForm.get(['id'])!.value,
      usuarioFotoContentType: this.editForm.get(['usuarioFotoContentType'])!.value,
      usuarioFoto: this.editForm.get(['usuarioFoto'])!.value,
      usuarioNome: this.editForm.get(['usuarioNome'])!.value,
      usuarioCPF: this.editForm.get(['usuarioCPF'])!.value,
      usuarioDataNascimento: this.editForm.get(['usuarioDataNascimento'])!.value,
      user: this.editForm.get(['user'])!.value,
      cidades: this.editForm.get(['cidades'])!.value,
    };
  }
}
