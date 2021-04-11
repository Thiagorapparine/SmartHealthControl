jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProfissionaisService } from '../service/profissionais.service';
import { IProfissionais, Profissionais } from '../profissionais.model';
import { IEstados } from 'app/entities/estados/estados.model';
import { EstadosService } from 'app/entities/estados/service/estados.service';
import { ISetorSaude } from 'app/entities/setor-saude/setor-saude.model';
import { SetorSaudeService } from 'app/entities/setor-saude/service/setor-saude.service';

import { ProfissionaisUpdateComponent } from './profissionais-update.component';

describe('Component Tests', () => {
  describe('Profissionais Management Update Component', () => {
    let comp: ProfissionaisUpdateComponent;
    let fixture: ComponentFixture<ProfissionaisUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let profissionaisService: ProfissionaisService;
    let estadosService: EstadosService;
    let setorSaudeService: SetorSaudeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProfissionaisUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProfissionaisUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProfissionaisUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      profissionaisService = TestBed.inject(ProfissionaisService);
      estadosService = TestBed.inject(EstadosService);
      setorSaudeService = TestBed.inject(SetorSaudeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call estados query and add missing value', () => {
        const profissionais: IProfissionais = { id: 'CBA' };
        const estados: IEstados = { id: 'e-markets' };
        profissionais.estados = estados;

        const estadosCollection: IEstados[] = [{ id: 'salmão back-end input' }];
        spyOn(estadosService, 'query').and.returnValue(of(new HttpResponse({ body: estadosCollection })));
        const expectedCollection: IEstados[] = [estados, ...estadosCollection];
        spyOn(estadosService, 'addEstadosToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ profissionais });
        comp.ngOnInit();

        expect(estadosService.query).toHaveBeenCalled();
        expect(estadosService.addEstadosToCollectionIfMissing).toHaveBeenCalledWith(estadosCollection, estados);
        expect(comp.estadosCollection).toEqual(expectedCollection);
      });

      it('Should call setorSaude query and add missing value', () => {
        const profissionais: IProfissionais = { id: 'CBA' };
        const setorSaude: ISetorSaude = { id: 'transmitting Dynamic' };
        profissionais.setorSaude = setorSaude;

        const setorSaudeCollection: ISetorSaude[] = [{ id: 'connect Bedfordshire açafrão' }];
        spyOn(setorSaudeService, 'query').and.returnValue(of(new HttpResponse({ body: setorSaudeCollection })));
        const expectedCollection: ISetorSaude[] = [setorSaude, ...setorSaudeCollection];
        spyOn(setorSaudeService, 'addSetorSaudeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ profissionais });
        comp.ngOnInit();

        expect(setorSaudeService.query).toHaveBeenCalled();
        expect(setorSaudeService.addSetorSaudeToCollectionIfMissing).toHaveBeenCalledWith(setorSaudeCollection, setorSaude);
        expect(comp.setorSaudesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const profissionais: IProfissionais = { id: 'CBA' };
        const estados: IEstados = { id: 'Netherlands' };
        profissionais.estados = estados;
        const setorSaude: ISetorSaude = { id: 'Loan GB monitor' };
        profissionais.setorSaude = setorSaude;

        activatedRoute.data = of({ profissionais });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(profissionais));
        expect(comp.estadosCollection).toContain(estados);
        expect(comp.setorSaudesCollection).toContain(setorSaude);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const profissionais = { id: 'ABC' };
        spyOn(profissionaisService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ profissionais });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: profissionais }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(profissionaisService.update).toHaveBeenCalledWith(profissionais);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const profissionais = new Profissionais();
        spyOn(profissionaisService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ profissionais });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: profissionais }));
        saveSubject.complete();

        // THEN
        expect(profissionaisService.create).toHaveBeenCalledWith(profissionais);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const profissionais = { id: 'ABC' };
        spyOn(profissionaisService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ profissionais });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(profissionaisService.update).toHaveBeenCalledWith(profissionais);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEstadosById', () => {
        it('Should return tracked Estados primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackEstadosById(0, entity);
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
    });
  });
});
