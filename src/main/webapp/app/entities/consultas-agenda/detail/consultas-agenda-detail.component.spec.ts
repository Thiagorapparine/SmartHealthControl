import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConsultasAgendaDetailComponent } from './consultas-agenda-detail.component';

describe('Component Tests', () => {
  describe('ConsultasAgenda Management Detail Component', () => {
    let comp: ConsultasAgendaDetailComponent;
    let fixture: ComponentFixture<ConsultasAgendaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ConsultasAgendaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ consultasAgenda: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(ConsultasAgendaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ConsultasAgendaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load consultasAgenda on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.consultasAgenda).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
