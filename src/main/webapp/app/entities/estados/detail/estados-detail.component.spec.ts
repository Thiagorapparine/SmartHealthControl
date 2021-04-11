import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EstadosDetailComponent } from './estados-detail.component';

describe('Component Tests', () => {
  describe('Estados Management Detail Component', () => {
    let comp: EstadosDetailComponent;
    let fixture: ComponentFixture<EstadosDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EstadosDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ estados: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(EstadosDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EstadosDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load estados on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.estados).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
