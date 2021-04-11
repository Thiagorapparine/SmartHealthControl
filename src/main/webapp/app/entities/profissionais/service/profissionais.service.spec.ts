import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProfissionais, Profissionais } from '../profissionais.model';

import { ProfissionaisService } from './profissionais.service';

describe('Service Tests', () => {
  describe('Profissionais Service', () => {
    let service: ProfissionaisService;
    let httpMock: HttpTestingController;
    let elemDefault: IProfissionais;
    let expectedResult: IProfissionais | IProfissionais[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProfissionaisService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        profissionalNome: 'AAAAAAA',
        profissionalHoraInicio: 'AAAAAAA',
        profissionalHoraFim: 'AAAAAAA',
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

      it('should create a Profissionais', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Profissionais()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Profissionais', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            profissionalNome: 'BBBBBB',
            profissionalHoraInicio: 'BBBBBB',
            profissionalHoraFim: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Profissionais', () => {
        const patchObject = Object.assign(
          {
            profissionalNome: 'BBBBBB',
            profissionalHoraFim: 'BBBBBB',
          },
          new Profissionais()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Profissionais', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            profissionalNome: 'BBBBBB',
            profissionalHoraInicio: 'BBBBBB',
            profissionalHoraFim: 'BBBBBB',
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

      it('should delete a Profissionais', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProfissionaisToCollectionIfMissing', () => {
        it('should add a Profissionais to an empty array', () => {
          const profissionais: IProfissionais = { id: 'ABC' };
          expectedResult = service.addProfissionaisToCollectionIfMissing([], profissionais);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(profissionais);
        });

        it('should not add a Profissionais to an array that contains it', () => {
          const profissionais: IProfissionais = { id: 'ABC' };
          const profissionaisCollection: IProfissionais[] = [
            {
              ...profissionais,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addProfissionaisToCollectionIfMissing(profissionaisCollection, profissionais);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Profissionais to an array that doesn't contain it", () => {
          const profissionais: IProfissionais = { id: 'ABC' };
          const profissionaisCollection: IProfissionais[] = [{ id: 'CBA' }];
          expectedResult = service.addProfissionaisToCollectionIfMissing(profissionaisCollection, profissionais);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(profissionais);
        });

        it('should add only unique Profissionais to an array', () => {
          const profissionaisArray: IProfissionais[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Guarani' }];
          const profissionaisCollection: IProfissionais[] = [{ id: 'ABC' }];
          expectedResult = service.addProfissionaisToCollectionIfMissing(profissionaisCollection, ...profissionaisArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const profissionais: IProfissionais = { id: 'ABC' };
          const profissionais2: IProfissionais = { id: 'CBA' };
          expectedResult = service.addProfissionaisToCollectionIfMissing([], profissionais, profissionais2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(profissionais);
          expect(expectedResult).toContain(profissionais2);
        });

        it('should accept null and undefined values', () => {
          const profissionais: IProfissionais = { id: 'ABC' };
          expectedResult = service.addProfissionaisToCollectionIfMissing([], null, profissionais, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(profissionais);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
