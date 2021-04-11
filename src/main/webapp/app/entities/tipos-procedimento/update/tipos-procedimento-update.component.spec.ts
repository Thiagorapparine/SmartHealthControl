jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TiposProcedimentoService } from '../service/tipos-procedimento.service';
import { ITiposProcedimento, TiposProcedimento } from '../tipos-procedimento.model';
import { ISetorSaude } from 'app/entities/setor-saude/setor-saude.model';
import { SetorSaudeService } from 'app/entities/setor-saude/service/setor-saude.service';

import { TiposProcedimentoUpdateComponent } from './tipos-procedimento-update.component';

describe('Component Tests', () => {
  describe('TiposProcedimento Management Update Component', () => {
    let comp: TiposProcedimentoUpdateComponent;
    let fixture: ComponentFixture<TiposProcedimentoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let tiposProcedimentoService: TiposProcedimentoService;
    let setorSaudeService: SetorSaudeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TiposProcedimentoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TiposProcedimentoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TiposProcedimentoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      tiposProcedimentoService = TestBed.inject(TiposProcedimentoService);
      setorSaudeService = TestBed.inject(SetorSaudeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call setorSaude query and add missing value', () => {
        const tiposProcedimento: ITiposProcedimento = { id: 'CBA' };
        const setorSaude: ISetorSaude = { id: 'groupware' };
        tiposProcedimento.setorSaude = setorSaude;

        const setorSaudeCollection: ISetorSaude[] = [{ id: 'Livros Eletrônicos Malawi' }];
        spyOn(setorSaudeService, 'query').and.returnValue(of(new HttpResponse({ body: setorSaudeCollection })));
        const expectedCollection: ISetorSaude[] = [setorSaude, ...setorSaudeCollection];
        spyOn(setorSaudeService, 'addSetorSaudeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ tiposProcedimento });
        comp.ngOnInit();

        expect(setorSaudeService.query).toHaveBeenCalled();
        expect(setorSaudeService.addSetorSaudeToCollectionIfMissing).toHaveBeenCalledWith(setorSaudeCollection, setorSaude);
        expect(comp.setorSaudesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const tiposProcedimento: ITiposProcedimento = { id: 'CBA' };
        const setorSaude: ISetorSaude = { id: 'Granito' };
        tiposProcedimento.setorSaude = setorSaude;

        activatedRoute.data = of({ tiposProcedimento });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(tiposProcedimento));
        expect(comp.setorSaudesCollection).toContain(setorSaude);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tiposProcedimento = { id: 'ABC' };
        spyOn(tiposProcedimentoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tiposProcedimento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tiposProcedimento }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(tiposProcedimentoService.update).toHaveBeenCalledWith(tiposProcedimento);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tiposProcedimento = new TiposProcedimento();
        spyOn(tiposProcedimentoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tiposProcedimento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tiposProcedimento }));
        saveSubject.complete();

        // THEN
        expect(tiposProcedimentoService.create).toHaveBeenCalledWith(tiposProcedimento);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tiposProcedimento = { id: 'ABC' };
        spyOn(tiposProcedimentoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tiposProcedimento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(tiposProcedimentoService.update).toHaveBeenCalledWith(tiposProcedimento);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
