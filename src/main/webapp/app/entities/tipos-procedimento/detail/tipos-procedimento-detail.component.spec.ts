import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DataUtils } from 'app/core/util/data-util.service';

import { TiposProcedimentoDetailComponent } from './tipos-procedimento-detail.component';

describe('Component Tests', () => {
  describe('TiposProcedimento Management Detail Component', () => {
    let comp: TiposProcedimentoDetailComponent;
    let fixture: ComponentFixture<TiposProcedimentoDetailComponent>;
    let dataUtils: DataUtils;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TiposProcedimentoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ tiposProcedimento: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(TiposProcedimentoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TiposProcedimentoDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = TestBed.inject(DataUtils);
    });

    describe('OnInit', () => {
      it('Should load tiposProcedimento on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.tiposProcedimento).toEqual(jasmine.objectContaining({ id: 'ABC' }));
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
