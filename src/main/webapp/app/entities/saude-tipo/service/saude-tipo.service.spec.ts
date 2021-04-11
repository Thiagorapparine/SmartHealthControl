import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISaudeTipo, SaudeTipo } from '../saude-tipo.model';

import { SaudeTipoService } from './saude-tipo.service';

describe('Service Tests', () => {
  describe('SaudeTipo Service', () => {
    let service: SaudeTipoService;
    let httpMock: HttpTestingController;
    let elemDefault: ISaudeTipo;
    let expectedResult: ISaudeTipo | ISaudeTipo[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SaudeTipoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        tipoIdentificacao: 'AAAAAAA',
        tipoDescricao: 'AAAAAAA',
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

      it('should create a SaudeTipo', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new SaudeTipo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SaudeTipo', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            tipoIdentificacao: 'BBBBBB',
            tipoDescricao: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SaudeTipo', () => {
        const patchObject = Object.assign(
          {
            tipoIdentificacao: 'BBBBBB',
            tipoDescricao: 'BBBBBB',
          },
          new SaudeTipo()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SaudeTipo', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            tipoIdentificacao: 'BBBBBB',
            tipoDescricao: 'BBBBBB',
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

      it('should delete a SaudeTipo', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSaudeTipoToCollectionIfMissing', () => {
        it('should add a SaudeTipo to an empty array', () => {
          const saudeTipo: ISaudeTipo = { id: 'ABC' };
          expectedResult = service.addSaudeTipoToCollectionIfMissing([], saudeTipo);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(saudeTipo);
        });

        it('should not add a SaudeTipo to an array that contains it', () => {
          const saudeTipo: ISaudeTipo = { id: 'ABC' };
          const saudeTipoCollection: ISaudeTipo[] = [
            {
              ...saudeTipo,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addSaudeTipoToCollectionIfMissing(saudeTipoCollection, saudeTipo);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SaudeTipo to an array that doesn't contain it", () => {
          const saudeTipo: ISaudeTipo = { id: 'ABC' };
          const saudeTipoCollection: ISaudeTipo[] = [{ id: 'CBA' }];
          expectedResult = service.addSaudeTipoToCollectionIfMissing(saudeTipoCollection, saudeTipo);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(saudeTipo);
        });

        it('should add only unique SaudeTipo to an array', () => {
          const saudeTipoArray: ISaudeTipo[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Genérico Buckinghamshire' }];
          const saudeTipoCollection: ISaudeTipo[] = [{ id: 'ABC' }];
          expectedResult = service.addSaudeTipoToCollectionIfMissing(saudeTipoCollection, ...saudeTipoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const saudeTipo: ISaudeTipo = { id: 'ABC' };
          const saudeTipo2: ISaudeTipo = { id: 'CBA' };
          expectedResult = service.addSaudeTipoToCollectionIfMissing([], saudeTipo, saudeTipo2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(saudeTipo);
          expect(expectedResult).toContain(saudeTipo2);
        });

        it('should accept null and undefined values', () => {
          const saudeTipo: ISaudeTipo = { id: 'ABC' };
          expectedResult = service.addSaudeTipoToCollectionIfMissing([], null, saudeTipo, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(saudeTipo);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
