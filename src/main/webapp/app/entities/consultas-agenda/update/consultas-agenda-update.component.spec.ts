jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ConsultasAgendaService } from '../service/consultas-agenda.service';
import { IConsultasAgenda, ConsultasAgenda } from '../consultas-agenda.model';
import { IUsuariosSaude } from 'app/entities/usuarios-saude/usuarios-saude.model';
import { UsuariosSaudeService } from 'app/entities/usuarios-saude/service/usuarios-saude.service';
import { ISetorSaude } from 'app/entities/setor-saude/setor-saude.model';
import { SetorSaudeService } from 'app/entities/setor-saude/service/setor-saude.service';
import { IEntidadeSaude } from 'app/entities/entidade-saude/entidade-saude.model';
import { EntidadeSaudeService } from 'app/entities/entidade-saude/service/entidade-saude.service';

import { ConsultasAgendaUpdateComponent } from './consultas-agenda-update.component';

describe('Component Tests', () => {
  describe('ConsultasAgenda Management Update Component', () => {
    let comp: ConsultasAgendaUpdateComponent;
    let fixture: ComponentFixture<ConsultasAgendaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let consultasAgendaService: ConsultasAgendaService;
    let usuariosSaudeService: UsuariosSaudeService;
    let setorSaudeService: SetorSaudeService;
    let entidadeSaudeService: EntidadeSaudeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConsultasAgendaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ConsultasAgendaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConsultasAgendaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      consultasAgendaService = TestBed.inject(ConsultasAgendaService);
      usuariosSaudeService = TestBed.inject(UsuariosSaudeService);
      setorSaudeService = TestBed.inject(SetorSaudeService);
      entidadeSaudeService = TestBed.inject(EntidadeSaudeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call usuariosSaude query and add missing value', () => {
        const consultasAgenda: IConsultasAgenda = { id: 'CBA' };
        const usuariosSaude: IUsuariosSaude = { id: 'Aço' };
        consultasAgenda.usuariosSaude = usuariosSaude;

        const usuariosSaudeCollection: IUsuariosSaude[] = [{ id: 'payment Teclado Borders' }];
        spyOn(usuariosSaudeService, 'query').and.returnValue(of(new HttpResponse({ body: usuariosSaudeCollection })));
        const expectedCollection: IUsuariosSaude[] = [usuariosSaude, ...usuariosSaudeCollection];
        spyOn(usuariosSaudeService, 'addUsuariosSaudeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ consultasAgenda });
        comp.ngOnInit();

        expect(usuariosSaudeService.query).toHaveBeenCalled();
        expect(usuariosSaudeService.addUsuariosSaudeToCollectionIfMissing).toHaveBeenCalledWith(usuariosSaudeCollection, usuariosSaude);
        expect(comp.usuariosSaudesCollection).toEqual(expectedCollection);
      });

      it('Should call setorSaude query and add missing value', () => {
        const consultasAgenda: IConsultasAgenda = { id: 'CBA' };
        const setorSaude: ISetorSaude = { id: 'exploit withdrawal Travessa' };
        consultasAgenda.setorSaude = setorSaude;

        const setorSaudeCollection: ISetorSaude[] = [{ id: 'Credit' }];
        spyOn(setorSaudeService, 'query').and.returnValue(of(new HttpResponse({ body: setorSaudeCollection })));
        const expectedCollection: ISetorSaude[] = [setorSaude, ...setorSaudeCollection];
        spyOn(setorSaudeService, 'addSetorSaudeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ consultasAgenda });
        comp.ngOnInit();

        expect(setorSaudeService.query).toHaveBeenCalled();
        expect(setorSaudeService.addSetorSaudeToCollectionIfMissing).toHaveBeenCalledWith(setorSaudeCollection, setorSaude);
        expect(comp.setorSaudesCollection).toEqual(expectedCollection);
      });

      it('Should call entidadeSaude query and add missing value', () => {
        const consultasAgenda: IConsultasAgenda = { id: 'CBA' };
        const entidadeSaude: IEntidadeSaude = { id: 'repurpose' };
        consultasAgenda.entidadeSaude = entidadeSaude;

        const entidadeSaudeCollection: IEntidadeSaude[] = [{ id: 'Jardim reboot' }];
        spyOn(entidadeSaudeService, 'query').and.returnValue(of(new HttpResponse({ body: entidadeSaudeCollection })));
        const expectedCollection: IEntidadeSaude[] = [entidadeSaude, ...entidadeSaudeCollection];
        spyOn(entidadeSaudeService, 'addEntidadeSaudeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ consultasAgenda });
        comp.ngOnInit();

        expect(entidadeSaudeService.query).toHaveBeenCalled();
        expect(entidadeSaudeService.addEntidadeSaudeToCollectionIfMissing).toHaveBeenCalledWith(entidadeSaudeCollection, entidadeSaude);
        expect(comp.entidadeSaudesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const consultasAgenda: IConsultasAgenda = { id: 'CBA' };
        const usuariosSaude: IUsuariosSaude = { id: 'human-resource Concreto' };
        consultasAgenda.usuariosSaude = usuariosSaude;
        const setorSaude: ISetorSaude = { id: 'leverage' };
        consultasAgenda.setorSaude = setorSaude;
        const entidadeSaude: IEntidadeSaude = { id: 'índigo Loan Senior' };
        consultasAgenda.entidadeSaude = entidadeSaude;

        activatedRoute.data = of({ consultasAgenda });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(consultasAgenda));
        expect(comp.usuariosSaudesCollection).toContain(usuariosSaude);
        expect(comp.setorSaudesCollection).toContain(setorSaude);
        expect(comp.entidadeSaudesCollection).toContain(entidadeSaude);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const consultasAgenda = { id: 'ABC' };
        spyOn(consultasAgendaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ consultasAgenda });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consultasAgenda }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(consultasAgendaService.update).toHaveBeenCalledWith(consultasAgenda);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const consultasAgenda = new ConsultasAgenda();
        spyOn(consultasAgendaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ consultasAgenda });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consultasAgenda }));
        saveSubject.complete();

        // THEN
        expect(consultasAgendaService.create).toHaveBeenCalledWith(consultasAgenda);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const consultasAgenda = { id: 'ABC' };
        spyOn(consultasAgendaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ consultasAgenda });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(consultasAgendaService.update).toHaveBeenCalledWith(consultasAgenda);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUsuariosSaudeById', () => {
        it('Should return tracked UsuariosSaude primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackUsuariosSaudeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackSetorSaudeById', () => {
        it('Should return tracked SetorSaude primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackSetorSaudeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackEntidadeSaudeById', () => {
        it('Should return tracked EntidadeSaude primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackEntidadeSaudeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
