import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EstadosService } from '../service/estados.service';

import { EstadosComponent } from './estados.component';

describe('Component Tests', () => {
  describe('Estados Management Component', () => {
    let comp: EstadosComponent;
    let fixture: ComponentFixture<EstadosComponent>;
    let service: EstadosService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EstadosComponent],
      })
        .overrideTemplate(EstadosComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EstadosComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EstadosService);

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
      expect(comp.estados?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
