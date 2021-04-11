import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SetorSaudeDetailComponent } from './setor-saude-detail.component';

describe('Component Tests', () => {
  describe('SetorSaude Management Detail Component', () => {
    let comp: SetorSaudeDetailComponent;
    let fixture: ComponentFixture<SetorSaudeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SetorSaudeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ setorSaude: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(SetorSaudeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SetorSaudeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load setorSaude on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.setorSaude).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
