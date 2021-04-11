import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProfissionaisService } from '../service/profissionais.service';

import { ProfissionaisComponent } from './profissionais.component';

describe('Component Tests', () => {
  describe('Profissionais Management Component', () => {
    let comp: ProfissionaisComponent;
    let fixture: ComponentFixture<ProfissionaisComponent>;
    let service: ProfissionaisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProfissionaisComponent],
      })
        .overrideTemplate(ProfissionaisComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProfissionaisComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProfissionaisService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 'ABC' }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.profissionais?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
