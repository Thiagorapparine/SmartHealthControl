import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UsuariosSaudeService } from '../service/usuarios-saude.service';

import { UsuariosSaudeComponent } from './usuarios-saude.component';

describe('Component Tests', () => {
  describe('UsuariosSaude Management Component', () => {
    let comp: UsuariosSaudeComponent;
    let fixture: ComponentFixture<UsuariosSaudeComponent>;
    let service: UsuariosSaudeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UsuariosSaudeComponent],
      })
        .overrideTemplate(UsuariosSaudeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UsuariosSaudeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(UsuariosSaudeService);

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
      expect(comp.usuariosSaudes?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
