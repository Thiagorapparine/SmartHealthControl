jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ExamesAgendaService } from '../service/exames-agenda.service';
import { IExamesAgenda, ExamesAgenda } from '../exames-agenda.model';
import { ITiposProcedimento } from 'app/entities/tipos-procedimento/tipos-procedimento.model';
import { TiposProcedimentoService } from 'app/entities/tipos-procedimento/service/tipos-procedimento.service';
import { IEntidadeSaude } from 'app/entities/entidade-saude/entidade-saude.model';
import { EntidadeSaudeService } from 'app/entities/entidade-saude/service/entidade-saude.service';

import { ExamesAgendaUpdateComponent } from './exames-agenda-update.component';

describe('Component Tests', () => {
  describe('ExamesAgenda Management Update Component', () => {
    let comp: ExamesAgendaUpdateComponent;
    let fixture: ComponentFixture<ExamesAgendaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let examesAgendaService: ExamesAgendaService;
    let tiposProcedimentoService: TiposProcedimentoService;
    let entidadeSaudeService: EntidadeSaudeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExamesAgendaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ExamesAgendaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExamesAgendaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      examesAgendaService = TestBed.inject(ExamesAgendaService);
      tiposProcedimentoService = TestBed.inject(TiposProcedimentoService);
      entidadeSaudeService = TestBed.inject(EntidadeSaudeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call tiposProcedimento query and add missing value', () => {
        const examesAgenda: IExamesAgenda = { id: 'CBA' };
        const tiposProcedimento: ITiposProcedimento = { id: 'withdrawal' };
        examesAgenda.tiposProcedimento = tiposProcedimento;

        const tiposProcedimentoCollection: ITiposProcedimento[] = [{ id: 'Intranet Malvinas pele' }];
        spyOn(tiposProcedimentoService, 'query').and.returnValue(of(new HttpResponse({ body: tiposProcedimentoCollection })));
        const expectedCollection: ITiposProcedimento[] = [tiposProcedimento, ...tiposProcedimentoCollection];
        spyOn(tiposProcedimentoService, 'addTiposProcedimentoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ examesAgenda });
        comp.ngOnInit();

        expect(tiposProcedimentoService.query).toHaveBeenCalled();
        expect(tiposProcedimentoService.addTiposProcedimentoToCollectionIfMissing).toHaveBeenCalledWith(
          tiposProcedimentoCollection,
          tiposProcedimento
        );
        expect(comp.tiposProcedimentosCollection).toEqual(expectedCollection);
      });

      it('Should call entidadeSaude query and add missing value', () => {
        const examesAgenda: IExamesAgenda = { id: 'CBA' };
        const entidadeSaude: IEntidadeSaude = { id: 'systematic Madeira' };
        examesAgenda.entidadeSaude = entidadeSaude;

        const entidadeSaudeCollection: IEntidadeSaude[] = [{ id: 'optimal' }];
        spyOn(entidadeSaudeService, 'query').and.returnValue(of(new HttpResponse({ body: entidadeSaudeCollection })));
        const expectedCollection: IEntidadeSaude[] = [entidadeSaude, ...entidadeSaudeCollection];
        spyOn(entidadeSaudeService, 'addEntidadeSaudeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ examesAgenda });
        comp.ngOnInit();

        expect(entidadeSaudeService.query).toHaveBeenCalled();
        expect(entidadeSaudeService.addEntidadeSaudeToCollectionIfMissing).toHaveBeenCalledWith(entidadeSaudeCollection, entidadeSaude);
        expect(comp.entidadeSaudesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const examesAgenda: IExamesAgenda = { id: 'CBA' };
        const tiposProcedimento: ITiposProcedimento = { id: 'Direct copying architecture' };
        examesAgenda.tiposProcedimento = tiposProcedimento;
        const entidadeSaude: IEntidadeSaude = { id: 'cinza' };
        examesAgenda.entidadeSaude = entidadeSaude;

        activatedRoute.data = of({ examesAgenda });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(examesAgenda));
        expect(comp.tiposProcedimentosCollection).toContain(tiposProcedimento);
        expect(comp.entidadeSaudesCollection).toContain(entidadeSaude);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const examesAgenda = { id: 'ABC' };
        spyOn(examesAgendaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ examesAgenda });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: examesAgenda }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(examesAgendaService.update).toHaveBeenCalledWith(examesAgenda);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const examesAgenda = new ExamesAgenda();
        spyOn(examesAgendaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ examesAgenda });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: examesAgenda }));
        saveSubject.complete();

        // THEN
        expect(examesAgendaService.create).toHaveBeenCalledWith(examesAgenda);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const examesAgenda = { id: 'ABC' };
        spyOn(examesAgendaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ examesAgenda });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(examesAgendaService.update).toHaveBeenCalledWith(examesAgenda);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTiposProcedimentoById', () => {
        it('Should return tracked TiposProcedimento primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackTiposProcedimentoById(0, entity);
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
