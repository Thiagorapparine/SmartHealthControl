jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EstadosService } from '../service/estados.service';

import { EstadosDeleteDialogComponent } from './estados-delete-dialog.component';

describe('Component Tests', () => {
  describe('Estados Management Delete Component', () => {
    let comp: EstadosDeleteDialogComponent;
    let fixture: ComponentFixture<EstadosDeleteDialogComponent>;
    let service: EstadosService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EstadosDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(EstadosDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EstadosDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EstadosService);
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
