jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EntidadeSaudeService } from '../service/entidade-saude.service';
import { IEntidadeSaude, EntidadeSaude } from '../entidade-saude.model';
import { ISaudeTipo } from 'app/entities/saude-tipo/saude-tipo.model';
import { SaudeTipoService } from 'app/entities/saude-tipo/service/saude-tipo.service';
import { IEstados } from 'app/entities/estados/estados.model';
import { EstadosService } from 'app/entities/estados/service/estados.service';
import { ICidades } from 'app/entities/cidades/cidades.model';
import { CidadesService } from 'app/entities/cidades/service/cidades.service';
import { ITiposProcedimento } from 'app/entities/tipos-procedimento/tipos-procedimento.model';
import { TiposProcedimentoService } from 'app/entities/tipos-procedimento/service/tipos-procedimento.service';
import { IProfissionais } from 'app/entities/profissionais/profissionais.model';
import { ProfissionaisService } from 'app/entities/profissionais/service/profissionais.service';

import { EntidadeSaudeUpdateComponent } from './entidade-saude-update.component';

describe('Component Tests', () => {
  describe('EntidadeSaude Management Update Component', () => {
    let comp: EntidadeSaudeUpdateComponent;
    let fixture: ComponentFixture<EntidadeSaudeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let entidadeSaudeService: EntidadeSaudeService;
    let saudeTipoService: SaudeTipoService;
    let estadosService: EstadosService;
    let cidadesService: CidadesService;
    let tiposProcedimentoService: TiposProcedimentoService;
    let profissionaisService: ProfissionaisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EntidadeSaudeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EntidadeSaudeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EntidadeSaudeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      entidadeSaudeService = TestBed.inject(EntidadeSaudeService);
      saudeTipoService = TestBed.inject(SaudeTipoService);
      estadosService = TestBed.inject(EstadosService);
      cidadesService = TestBed.inject(CidadesService);
      tiposProcedimentoService = TestBed.inject(TiposProcedimentoService);
      profissionaisService = TestBed.inject(ProfissionaisService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call saudeTipo query and add missing value', () => {
        const entidadeSaude: IEntidadeSaude = { id: 'CBA' };
        const saudeTipo: ISaudeTipo = { id: 'tolerance generate' };
        entidadeSaude.saudeTipo = saudeTipo;

        const saudeTipoCollection: ISaudeTipo[] = [{ id: 'Factors' }];
        spyOn(saudeTipoService, 'query').and.returnValue(of(new HttpResponse({ body: saudeTipoCollection })));
        const expectedCollection: ISaudeTipo[] = [saudeTipo, ...saudeTipoCollection];
        spyOn(saudeTipoService, 'addSaudeTipoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ entidadeSaude });
        comp.ngOnInit();

        expect(saudeTipoService.query).toHaveBeenCalled();
        expect(saudeTipoService.addSaudeTipoToCollectionIfMissing).toHaveBeenCalledWith(saudeTipoCollection, saudeTipo);
        expect(comp.saudeTiposCollection).toEqual(expectedCollection);
      });

      it('Should call estados query and add missing value', () => {
        const entidadeSaude: IEntidadeSaude = { id: 'CBA' };
        const estados: IEstados = { id: 'Group Managed' };
        entidadeSaude.estados = estados;

        const estadosCollection: IEstados[] = [{ id: 'Automated Kwacha Queijo' }];
        spyOn(estadosService, 'query').and.returnValue(of(new HttpResponse({ body: estadosCollection })));
        const expectedCollection: IEstados[] = [estados, ...estadosCollection];
        spyOn(estadosService, 'addEstadosToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ entidadeSaude });
        comp.ngOnInit();

        expect(estadosService.query).toHaveBeenCalled();
        expect(estadosService.addEstadosToCollectionIfMissing).toHaveBeenCalledWith(estadosCollection, estados);
        expect(comp.estadosCollection).toEqual(expectedCollection);
      });

      it('Should call cidades query and add missing value', () => {
        const entidadeSaude: IEntidadeSaude = { id: 'CBA' };
        const cidades: ICidades = { id: 'compress Camiseta' };
        entidadeSaude.cidades = cidades;

        const cidadesCollection: ICidades[] = [{ id: 'interface' }];
        spyOn(cidadesService, 'query').and.returnValue(of(new HttpResponse({ body: cidadesCollection })));
        const expectedCollection: ICidades[] = [cidades, ...cidadesCollection];
        spyOn(cidadesService, 'addCidadesToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ entidadeSaude });
        comp.ngOnInit();

        expect(cidadesService.query).toHaveBeenCalled();
        expect(cidadesService.addCidadesToCollectionIfMissing).toHaveBeenCalledWith(cidadesCollection, cidades);
        expect(comp.cidadesCollection).toEqual(expectedCollection);
      });

      it('Should call TiposProcedimento query and add missing value', () => {
        const entidadeSaude: IEntidadeSaude = { id: 'CBA' };
        const tiposProcedimentos: ITiposProcedimento[] = [{ id: 'back transform Checking' }];
        entidadeSaude.tiposProcedimentos = tiposProcedimentos;

        const tiposProcedimentoCollection: ITiposProcedimento[] = [{ id: 'withdrawal' }];
        spyOn(tiposProcedimentoService, 'query').and.returnValue(of(new HttpResponse({ body: tiposProcedimentoCollection })));
        const additionalTiposProcedimentos = [...tiposProcedimentos];
        const expectedCollection: ITiposProcedimento[] = [...additionalTiposProcedimentos, ...tiposProcedimentoCollection];
        spyOn(tiposProcedimentoService, 'addTiposProcedimentoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ entidadeSaude });
        comp.ngOnInit();

        expect(tiposProcedimentoService.query).toHaveBeenCalled();
        expect(tiposProcedimentoService.addTiposProcedimentoToCollectionIfMissing).toHaveBeenCalledWith(
          tiposProcedimentoCollection,
          ...additionalTiposProcedimentos
        );
        expect(comp.tiposProcedimentosSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Profissionais query and add missing value', () => {
        const entidadeSaude: IEntidadeSaude = { id: 'CBA' };
        const profissionais: IProfissionais[] = [{ id: 'Salgadinhos maximize' }];
        entidadeSaude.profissionais = profissionais;

        const profissionaisCollection: IProfissionais[] = [{ id: 'UIC-Franc caramelo COM' }];
        spyOn(profissionaisService, 'query').and.returnValue(of(new HttpResponse({ body: profissionaisCollection })));
        const additionalProfissionais = [...profissionais];
        const expectedCollection: IProfissionais[] = [...additionalProfissionais, ...profissionaisCollection];
        spyOn(profissionaisService, 'addProfissionaisToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ entidadeSaude });
        comp.ngOnInit();

        expect(profissionaisService.query).toHaveBeenCalled();
        expect(profissionaisService.addProfissionaisToCollectionIfMissing).toHaveBeenCalledWith(
          profissionaisCollection,
          ...additionalProfissionais
        );
        expect(comp.profissionaisSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const entidadeSaude: IEntidadeSaude = { id: 'CBA' };
        const saudeTipo: ISaudeTipo = { id: 'Enhanced Travessa' };
        entidadeSaude.saudeTipo = saudeTipo;
        const estados: IEstados = { id: 'Consultant transmitting' };
        entidadeSaude.estados = estados;
        const cidades: ICidades = { id: 'Licenciado clicks-and-mortar' };
        entidadeSaude.cidades = cidades;
        const tiposProcedimentos: ITiposProcedimento = { id: 'navigating time-frame web-enabled' };
        entidadeSaude.tiposProcedimentos = [tiposProcedimentos];
        const profissionais: IProfissionais = { id: 'program success reserved' };
        entidadeSaude.profissionais = [profissionais];

        activatedRoute.data = of({ entidadeSaude });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(entidadeSaude));
        expect(comp.saudeTiposCollection).toContain(saudeTipo);
        expect(comp.estadosCollection).toContain(estados);
        expect(comp.cidadesCollection).toContain(cidades);
        expect(comp.tiposProcedimentosSharedCollection).toContain(tiposProcedimentos);
        expect(comp.profissionaisSharedCollection).toContain(profissionais);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const entidadeSaude = { id: 'ABC' };
        spyOn(entidadeSaudeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ entidadeSaude });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: entidadeSaude }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(entidadeSaudeService.update).toHaveBeenCalledWith(entidadeSaude);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const entidadeSaude = new EntidadeSaude();
        spyOn(entidadeSaudeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ entidadeSaude });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: entidadeSaude }));
        saveSubject.complete();

        // THEN
        expect(entidadeSaudeService.create).toHaveBeenCalledWith(entidadeSaude);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const entidadeSaude = { id: 'ABC' };
        spyOn(entidadeSaudeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ entidadeSaude });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(entidadeSaudeService.update).toHaveBeenCalledWith(entidadeSaude);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSaudeTipoById', () => {
        it('Should return tracked SaudeTipo primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackSaudeTipoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackEstadosById', () => {
        it('Should return tracked Estados primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackEstadosById(0, entity);
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

      describe('trackTiposProcedimentoById', () => {
        it('Should return tracked TiposProcedimento primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackTiposProcedimentoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackProfissionaisById', () => {
        it('Should return tracked Profissionais primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackProfissionaisById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedTiposProcedimento', () => {
        it('Should return option if no TiposProcedimento is selected', () => {
          const option = { id: 'ABC' };
          const result = comp.getSelectedTiposProcedimento(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected TiposProcedimento for according option', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'ABC' };
          const selected2 = { id: 'CBA' };
          const result = comp.getSelectedTiposProcedimento(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this TiposProcedimento is not selected', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'CBA' };
          const result = comp.getSelectedTiposProcedimento(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });

      describe('getSelectedProfissionais', () => {
        it('Should return option if no Profissionais is selected', () => {
          const option = { id: 'ABC' };
          const result = comp.getSelectedProfissionais(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Profissionais for according option', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'ABC' };
          const selected2 = { id: 'CBA' };
          const result = comp.getSelectedProfissionais(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Profissionais is not selected', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'CBA' };
          const result = comp.getSelectedProfissionais(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
