jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SaudeTipoService } from '../service/saude-tipo.service';
import { ISaudeTipo, SaudeTipo } from '../saude-tipo.model';

import { SaudeTipoUpdateComponent } from './saude-tipo-update.component';

describe('Component Tests', () => {
  describe('SaudeTipo Management Update Component', () => {
    let comp: SaudeTipoUpdateComponent;
    let fixture: ComponentFixture<SaudeTipoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let saudeTipoService: SaudeTipoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SaudeTipoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SaudeTipoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SaudeTipoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      saudeTipoService = TestBed.inject(SaudeTipoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const saudeTipo: ISaudeTipo = { id: 'CBA' };

        activatedRoute.data = of({ saudeTipo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(saudeTipo));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const saudeTipo = { id: 'ABC' };
        spyOn(saudeTipoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ saudeTipo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: saudeTipo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(saudeTipoService.update).toHaveBeenCalledWith(saudeTipo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const saudeTipo = new SaudeTipo();
        spyOn(saudeTipoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ saudeTipo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: saudeTipo }));
        saveSubject.complete();

        // THEN
        expect(saudeTipoService.create).toHaveBeenCalledWith(saudeTipo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const saudeTipo = { id: 'ABC' };
        spyOn(saudeTipoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ saudeTipo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(saudeTipoService.update).toHaveBeenCalledWith(saudeTipo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
