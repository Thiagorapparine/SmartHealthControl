import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SetorSaudeService } from '../service/setor-saude.service';

import { SetorSaudeComponent } from './setor-saude.component';

describe('Component Tests', () => {
  describe('SetorSaude Management Component', () => {
    let comp: SetorSaudeComponent;
    let fixture: ComponentFixture<SetorSaudeComponent>;
    let service: SetorSaudeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SetorSaudeComponent],
      })
        .overrideTemplate(SetorSaudeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SetorSaudeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SetorSaudeService);

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
      expect(comp.setorSaudes?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
