jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EntidadeSaudeService } from '../service/entidade-saude.service';

import { EntidadeSaudeDeleteDialogComponent } from './entidade-saude-delete-dialog.component';

describe('Component Tests', () => {
  describe('EntidadeSaude Management Delete Component', () => {
    let comp: EntidadeSaudeDeleteDialogComponent;
    let fixture: ComponentFixture<EntidadeSaudeDeleteDialogComponent>;
    let service: EntidadeSaudeService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EntidadeSaudeDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(EntidadeSaudeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EntidadeSaudeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EntidadeSaudeService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete('ABC');
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith('ABC');
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
