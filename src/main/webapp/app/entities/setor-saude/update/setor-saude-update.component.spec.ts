jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SetorSaudeService } from '../service/setor-saude.service';
import { ISetorSaude, SetorSaude } from '../setor-saude.model';

import { SetorSaudeUpdateComponent } from './setor-saude-update.component';

describe('Component Tests', () => {
  describe('SetorSaude Management Update Component', () => {
    let comp: SetorSaudeUpdateComponent;
    let fixture: ComponentFixture<SetorSaudeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let setorSaudeService: SetorSaudeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SetorSaudeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SetorSaudeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SetorSaudeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      setorSaudeService = TestBed.inject(SetorSaudeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const setorSaude: ISetorSaude = { id: 'CBA' };

        activatedRoute.data = of({ setorSaude });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(setorSaude));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const setorSaude = { id: 'ABC' };
        spyOn(setorSaudeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ setorSaude });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: setorSaude }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(setorSaudeService.update).toHaveBeenCalledWith(setorSaude);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const setorSaude = new SetorSaude();
        spyOn(setorSaudeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ setorSaude });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: setorSaude }));
        saveSubject.complete();

        // THEN
        expect(setorSaudeService.create).toHaveBeenCalledWith(setorSaude);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const setorSaude = { id: 'ABC' };
        spyOn(setorSaudeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ setorSaude });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(setorSaudeService.update).toHaveBeenCalledWith(setorSaude);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
