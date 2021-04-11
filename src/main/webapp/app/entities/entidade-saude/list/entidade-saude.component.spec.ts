import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EntidadeSaudeService } from '../service/entidade-saude.service';

import { EntidadeSaudeComponent } from './entidade-saude.component';

describe('Component Tests', () => {
  describe('EntidadeSaude Management Component', () => {
    let comp: EntidadeSaudeComponent;
    let fixture: ComponentFixture<EntidadeSaudeComponent>;
    let service: EntidadeSaudeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EntidadeSaudeComponent],
      })
        .overrideTemplate(EntidadeSaudeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EntidadeSaudeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EntidadeSaudeService);

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
      expect(comp.entidadeSaudes?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
