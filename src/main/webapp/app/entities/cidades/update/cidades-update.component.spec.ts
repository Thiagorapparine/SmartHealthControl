jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CidadesService } from '../service/cidades.service';
import { ICidades, Cidades } from '../cidades.model';
import { IEstados } from 'app/entities/estados/estados.model';
import { EstadosService } from 'app/entities/estados/service/estados.service';

import { CidadesUpdateComponent } from './cidades-update.component';

describe('Component Tests', () => {
  describe('Cidades Management Update Component', () => {
    let comp: CidadesUpdateComponent;
    let fixture: ComponentFixture<CidadesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cidadesService: CidadesService;
    let estadosService: EstadosService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CidadesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CidadesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CidadesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cidadesService = TestBed.inject(CidadesService);
      estadosService = TestBed.inject(EstadosService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call estados query and add missing value', () => {
        const cidades: ICidades = { id: 'CBA' };
        const estados: IEstados = { id: 'Turquia' };
        cidades.estados = estados;

        const estadosCollection: IEstados[] = [{ id: 'Krona' }];
        spyOn(estadosService, 'query').and.returnValue(of(new HttpResponse({ body: estadosCollection })));
        const expectedCollection: IEstados[] = [estados, ...estadosCollection];
        spyOn(estadosService, 'addEstadosToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ cidades });
        comp.ngOnInit();

        expect(estadosService.query).toHaveBeenCalled();
        expect(estadosService.addEstadosToCollectionIfMissing).toHaveBeenCalledWith(estadosCollection, estados);
        expect(comp.estadosCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const cidades: ICidades = { id: 'CBA' };
        const estados: IEstados = { id: 'Interactions' };
        cidades.estados = estados;

        activatedRoute.data = of({ cidades });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cidades));
        expect(comp.estadosCollection).toContain(estados);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cidades = { id: 'ABC' };
        spyOn(cidadesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cidades });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cidades }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cidadesService.update).toHaveBeenCalledWith(cidades);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cidades = new Cidades();
        spyOn(cidadesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cidades });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cidades }));
        saveSubject.complete();

        // THEN
        expect(cidadesService.create).toHaveBeenCalledWith(cidades);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cidades = { id: 'ABC' };
        spyOn(cidadesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cidades });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cidadesService.update).toHaveBeenCalledWith(cidades);
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
    });
  });
});
