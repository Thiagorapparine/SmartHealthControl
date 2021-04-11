jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UsuariosSaudeService } from '../service/usuarios-saude.service';
import { IUsuariosSaude, UsuariosSaude } from '../usuarios-saude.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICidades } from 'app/entities/cidades/cidades.model';
import { CidadesService } from 'app/entities/cidades/service/cidades.service';

import { UsuariosSaudeUpdateComponent } from './usuarios-saude-update.component';

describe('Component Tests', () => {
  describe('UsuariosSaude Management Update Component', () => {
    let comp: UsuariosSaudeUpdateComponent;
    let fixture: ComponentFixture<UsuariosSaudeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let usuariosSaudeService: UsuariosSaudeService;
    let userService: UserService;
    let cidadesService: CidadesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UsuariosSaudeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UsuariosSaudeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UsuariosSaudeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      usuariosSaudeService = TestBed.inject(UsuariosSaudeService);
      userService = TestBed.inject(UserService);
      cidadesService = TestBed.inject(CidadesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const usuariosSaude: IUsuariosSaude = { id: 'CBA' };
        const user: IUser = { id: 'Berkshire Rústico Rodovia' };
        usuariosSaude.user = user;

        const userCollection: IUser[] = [{ id: 'Buckinghamshire Kwanza networks' }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ usuariosSaude });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call cidades query and add missing value', () => {
        const usuariosSaude: IUsuariosSaude = { id: 'CBA' };
        const cidades: ICidades = { id: 'matrix deliverables circuit' };
        usuariosSaude.cidades = cidades;

        const cidadesCollection: ICidades[] = [{ id: 'Filmes Cazaquistão data-warehouse' }];
        spyOn(cidadesService, 'query').and.returnValue(of(new HttpResponse({ body: cidadesCollection })));
        const expectedCollection: ICidades[] = [cidades, ...cidadesCollection];
        spyOn(cidadesService, 'addCidadesToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ usuariosSaude });
        comp.ngOnInit();

        expect(cidadesService.query).toHaveBeenCalled();
        expect(cidadesService.addCidadesToCollectionIfMissing).toHaveBeenCalledWith(cidadesCollection, cidades);
        expect(comp.cidadesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const usuariosSaude: IUsuariosSaude = { id: 'CBA' };
        const user: IUser = { id: 'Architect' };
        usuariosSaude.user = user;
        const cidades: ICidades = { id: 'optical Supervisor' };
        usuariosSaude.cidades = cidades;

        activatedRoute.data = of({ usuariosSaude });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(usuariosSaude));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.cidadesCollection).toContain(cidades);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usuariosSaude = { id: 'ABC' };
        spyOn(usuariosSaudeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usuariosSaude });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: usuariosSaude }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(usuariosSaudeService.update).toHaveBeenCalledWith(usuariosSaude);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usuariosSaude = new UsuariosSaude();
        spyOn(usuariosSaudeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usuariosSaude });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: usuariosSaude }));
        saveSubject.complete();

        // THEN
        expect(usuariosSaudeService.create).toHaveBeenCalledWith(usuariosSaude);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usuariosSaude = { id: 'ABC' };
        spyOn(usuariosSaudeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usuariosSaude });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(usuariosSaudeService.update).toHaveBeenCalledWith(usuariosSaude);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCidadesById', () => {
        it('Should return tracked Cidades primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackCidadesById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
