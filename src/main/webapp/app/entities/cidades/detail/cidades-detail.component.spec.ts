import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CidadesDetailComponent } from './cidades-detail.component';

describe('Component Tests', () => {
  describe('Cidades Management Detail Component', () => {
    let comp: CidadesDetailComponent;
    let fixture: ComponentFixture<CidadesDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CidadesDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ cidades: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(CidadesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CidadesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load cidades on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cidades).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
