jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EstadosService } from '../service/estados.service';
import { IEstados, Estados } from '../estados.model';

import { EstadosUpdateComponent } from './estados-update.component';

describe('Component Tests', () => {
  describe('Estados Management Update Component', () => {
    let comp: EstadosUpdateComponent;
    let fixture: ComponentFixture<EstadosUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let estadosService: EstadosService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EstadosUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EstadosUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EstadosUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      estadosService = TestBed.inject(EstadosService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const estados: IEstados = { id: 'CBA' };

        activatedRoute.data = of({ estados });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(estados));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const estados = { id: 'ABC' };
        spyOn(estadosService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ estados });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: estados }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(estadosService.update).toHaveBeenCalledWith(estados);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const estados = new Estados();
        spyOn(estadosService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ estados });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: estados }));
        saveSubject.complete();

        // THEN
        expect(estadosService.create).toHaveBeenCalledWith(estados);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const estados = { id: 'ABC' };
        spyOn(estadosService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ estados });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(estadosService.update).toHaveBeenCalledWith(estados);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
