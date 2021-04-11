import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DataUtils } from 'app/core/util/data-util.service';

import { SaudeTipoDetailComponent } from './saude-tipo-detail.component';

describe('Component Tests', () => {
  describe('SaudeTipo Management Detail Component', () => {
    let comp: SaudeTipoDetailComponent;
    let fixture: ComponentFixture<SaudeTipoDetailComponent>;
    let dataUtils: DataUtils;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SaudeTipoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ saudeTipo: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(SaudeTipoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SaudeTipoDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = TestBed.inject(DataUtils);
    });

    describe('OnInit', () => {
      it('Should load saudeTipo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.saudeTipo).toEqual(jasmine.objectContaining({ id: 'ABC' }));
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
