import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProfissionaisDetailComponent } from './profissionais-detail.component';

describe('Component Tests', () => {
  describe('Profissionais Management Detail Component', () => {
    let comp: ProfissionaisDetailComponent;
    let fixture: ComponentFixture<ProfissionaisDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProfissionaisDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ profissionais: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(ProfissionaisDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProfissionaisDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load profissionais on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.profissionais).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
