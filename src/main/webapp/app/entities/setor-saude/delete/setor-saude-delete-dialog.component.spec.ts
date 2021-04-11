jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SetorSaudeService } from '../service/setor-saude.service';

import { SetorSaudeDeleteDialogComponent } from './setor-saude-delete-dialog.component';

describe('Component Tests', () => {
  describe('SetorSaude Management Delete Component', () => {
    let comp: SetorSaudeDeleteDialogComponent;
    let fixture: ComponentFixture<SetorSaudeDeleteDialogComponent>;
    let service: SetorSaudeService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SetorSaudeDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(SetorSaudeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SetorSaudeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SetorSaudeService);
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
