import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EntidadeSaudeDetailComponent } from './entidade-saude-detail.component';

describe('Component Tests', () => {
  describe('EntidadeSaude Management Detail Component', () => {
    let comp: EntidadeSaudeDetailComponent;
    let fixture: ComponentFixture<EntidadeSaudeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EntidadeSaudeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ entidadeSaude: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(EntidadeSaudeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EntidadeSaudeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load entidadeSaude on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.entidadeSaude).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
