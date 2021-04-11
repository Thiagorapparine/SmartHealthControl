import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExamesAgendaDetailComponent } from './exames-agenda-detail.component';

describe('Component Tests', () => {
  describe('ExamesAgenda Management Detail Component', () => {
    let comp: ExamesAgendaDetailComponent;
    let fixture: ComponentFixture<ExamesAgendaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ExamesAgendaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ examesAgenda: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(ExamesAgendaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ExamesAgendaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load examesAgenda on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.examesAgenda).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
