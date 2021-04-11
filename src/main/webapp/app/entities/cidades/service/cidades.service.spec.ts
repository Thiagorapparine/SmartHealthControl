import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICidades, Cidades } from '../cidades.model';

import { CidadesService } from './cidades.service';

describe('Service Tests', () => {
  describe('Cidades Service', () => {
    let service: CidadesService;
    let httpMock: HttpTestingController;
    let elemDefault: ICidades;
    let expectedResult: ICidades | ICidades[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CidadesService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        cidadeNome: 'AAAAAAA',
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

      it('should create a Cidades', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Cidades()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Cidades', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            cidadeNome: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Cidades', () => {
        const patchObject = Object.assign({}, new Cidades());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Cidades', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            cidadeNome: 'BBBBBB',
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

      it('should delete a Cidades', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCidadesToCollectionIfMissing', () => {
        it('should add a Cidades to an empty array', () => {
          const cidades: ICidades = { id: 'ABC' };
          expectedResult = service.addCidadesToCollectionIfMissing([], cidades);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cidades);
        });

        it('should not add a Cidades to an array that contains it', () => {
          const cidades: ICidades = { id: 'ABC' };
          const cidadesCollection: ICidades[] = [
            {
              ...cidades,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addCidadesToCollectionIfMissing(cidadesCollection, cidades);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Cidades to an array that doesn't contain it", () => {
          const cidades: ICidades = { id: 'ABC' };
          const cidadesCollection: ICidades[] = [{ id: 'CBA' }];
          expectedResult = service.addCidadesToCollectionIfMissing(cidadesCollection, cidades);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cidades);
        });

        it('should add only unique Cidades to an array', () => {
          const cidadesArray: ICidades[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Auto payment' }];
          const cidadesCollection: ICidades[] = [{ id: 'ABC' }];
          expectedResult = service.addCidadesToCollectionIfMissing(cidadesCollection, ...cidadesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const cidades: ICidades = { id: 'ABC' };
          const cidades2: ICidades = { id: 'CBA' };
          expectedResult = service.addCidadesToCollectionIfMissing([], cidades, cidades2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cidades);
          expect(expectedResult).toContain(cidades2);
        });

        it('should accept null and undefined values', () => {
          const cidades: ICidades = { id: 'ABC' };
          expectedResult = service.addCidadesToCollectionIfMissing([], null, cidades, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cidades);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
