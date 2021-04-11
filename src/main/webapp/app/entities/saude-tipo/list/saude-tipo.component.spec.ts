import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SaudeTipoService } from '../service/saude-tipo.service';

import { SaudeTipoComponent } from './saude-tipo.component';

describe('Component Tests', () => {
  describe('SaudeTipo Management Component', () => {
    let comp: SaudeTipoComponent;
    let fixture: ComponentFixture<SaudeTipoComponent>;
    let service: SaudeTipoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SaudeTipoComponent],
      })
        .overrideTemplate(SaudeTipoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SaudeTipoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SaudeTipoService);

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
      expect(comp.saudeTipos?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
