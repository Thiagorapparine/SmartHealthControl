import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DataUtils } from 'app/core/util/data-util.service';

import { UsuariosSaudeDetailComponent } from './usuarios-saude-detail.component';

describe('Component Tests', () => {
  describe('UsuariosSaude Management Detail Component', () => {
    let comp: UsuariosSaudeDetailComponent;
    let fixture: ComponentFixture<UsuariosSaudeDetailComponent>;
    let dataUtils: DataUtils;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UsuariosSaudeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ usuariosSaude: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(UsuariosSaudeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UsuariosSaudeDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = TestBed.inject(DataUtils);
    });

    describe('OnInit', () => {
      it('Should load usuariosSaude on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.usuariosSaude).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from DataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from DataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeBase64, fakeContentType);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeBase64, fakeContentType);
      });
    });
  });
});
