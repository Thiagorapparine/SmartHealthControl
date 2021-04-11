import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITiposProcedimento, TiposProcedimento } from '../tipos-procedimento.model';

import { TiposProcedimentoService } from './tipos-procedimento.service';

describe('Service Tests', () => {
  describe('TiposProcedimento Service', () => {
    let service: TiposProcedimentoService;
    let httpMock: HttpTestingController;
    let elemDefault: ITiposProcedimento;
    let expectedResult: ITiposProcedimento | ITiposProcedimento[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TiposProcedimentoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        procedimentoNome: 'AAAAAAA',
        procedimentoDescricao: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a TiposProcedimento', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TiposProcedimento()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TiposProcedimento', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            procedimentoNome: 'BBBBBB',
            procedimentoDescricao: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a TiposProcedimento', () => {
        const patchObject = Object.assign(
          {
            procedimentoNome: 'BBBBBB',
            procedimentoDescricao: 'BBBBBB',
          },
          new TiposProcedimento()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TiposProcedimento', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            procedimentoNome: 'BBBBBB',
            procedimentoDescricao: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a TiposProcedimento', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTiposProcedimentoToCollectionIfMissing', () => {
        it('should add a TiposProcedimento to an empty array', () => {
          const tiposProcedimento: ITiposProcedimento = { id: 'ABC' };
          expectedResult = service.addTiposProcedimentoToCollectionIfMissing([], tiposProcedimento);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tiposProcedimento);
        });

        it('should not add a TiposProcedimento to an array that contains it', () => {
          const tiposProcedimento: ITiposProcedimento = { id: 'ABC' };
          const tiposProcedimentoCollection: ITiposProcedimento[] = [
            {
              ...tiposProcedimento,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addTiposProcedimentoToCollectionIfMissing(tiposProcedimentoCollection, tiposProcedimento);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TiposProcedimento to an array that doesn't contain it", () => {
          const tiposProcedimento: ITiposProcedimento = { id: 'ABC' };
          const tiposProcedimentoCollection: ITiposProcedimento[] = [{ id: 'CBA' }];
          expectedResult = service.addTiposProcedimentoToCollectionIfMissing(tiposProcedimentoCollection, tiposProcedimento);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tiposProcedimento);
        });

        it('should add only unique TiposProcedimento to an array', () => {
          const tiposProcedimentoArray: ITiposProcedimento[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Georgia monitor Associate' }];
          const tiposProcedimentoCollection: ITiposProcedimento[] = [{ id: 'ABC' }];
          expectedResult = service.addTiposProcedimentoToCollectionIfMissing(tiposProcedimentoCollection, ...tiposProcedimentoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const tiposProcedimento: ITiposProcedimento = { id: 'ABC' };
          const tiposProcedimento2: ITiposProcedimento = { id: 'CBA' };
          expectedResult = service.addTiposProcedimentoToCollectionIfMissing([], tiposProcedimento, tiposProcedimento2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tiposProcedimento);
          expect(expectedResult).toContain(tiposProcedimento2);
        });

        it('should accept null and undefined values', () => {
          const tiposProcedimento: ITiposProcedimento = { id: 'ABC' };
          expectedResult = service.addTiposProcedimentoToCollectionIfMissing([], null, tiposProcedimento, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tiposProcedimento);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
