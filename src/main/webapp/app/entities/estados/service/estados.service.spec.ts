import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEstados, Estados } from '../estados.model';

import { EstadosService } from './estados.service';

describe('Service Tests', () => {
  describe('Estados Service', () => {
    let service: EstadosService;
    let httpMock: HttpTestingController;
    let elemDefault: IEstados;
    let expectedResult: IEstados | IEstados[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EstadosService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        estadosNome: 'AAAAAAA',
        estadosSigla: 'AAAAAAA',
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

      it('should create a Estados', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Estados()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Estados', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            estadosNome: 'BBBBBB',
            estadosSigla: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Estados', () => {
        const patchObject = Object.assign({}, new Estados());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Estados', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            estadosNome: 'BBBBBB',
            estadosSigla: 'BBBBBB',
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

      it('should delete a Estados', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEstadosToCollectionIfMissing', () => {
        it('should add a Estados to an empty array', () => {
          const estados: IEstados = { id: 'ABC' };
          expectedResult = service.addEstadosToCollectionIfMissing([], estados);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(estados);
        });

        it('should not add a Estados to an array that contains it', () => {
          const estados: IEstados = { id: 'ABC' };
          const estadosCollection: IEstados[] = [
            {
              ...estados,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addEstadosToCollectionIfMissing(estadosCollection, estados);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Estados to an array that doesn't contain it", () => {
          const estados: IEstados = { id: 'ABC' };
          const estadosCollection: IEstados[] = [{ id: 'CBA' }];
          expectedResult = service.addEstadosToCollectionIfMissing(estadosCollection, estados);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(estados);
        });

        it('should add only unique Estados to an array', () => {
          const estadosArray: IEstados[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Jogos ' }];
          const estadosCollection: IEstados[] = [{ id: 'ABC' }];
          expectedResult = service.addEstadosToCollectionIfMissing(estadosCollection, ...estadosArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const estados: IEstados = { id: 'ABC' };
          const estados2: IEstados = { id: 'CBA' };
          expectedResult = service.addEstadosToCollectionIfMissing([], estados, estados2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(estados);
          expect(expectedResult).toContain(estados2);
        });

        it('should accept null and undefined values', () => {
          const estados: IEstados = { id: 'ABC' };
          expectedResult = service.addEstadosToCollectionIfMissing([], null, estados, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(estados);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
