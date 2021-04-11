import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SetorEntidade } from 'app/entities/enumerations/setor-entidade.model';
import { IEntidadeSaude, EntidadeSaude } from '../entidade-saude.model';

import { EntidadeSaudeService } from './entidade-saude.service';

describe('Service Tests', () => {
  describe('EntidadeSaude Service', () => {
    let service: EntidadeSaudeService;
    let httpMock: HttpTestingController;
    let elemDefault: IEntidadeSaude;
    let expectedResult: IEntidadeSaude | IEntidadeSaude[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EntidadeSaudeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        entidadeNome: 'AAAAAAA',
        entidadeSetor: SetorEntidade.Publica,
        entidadeEndereco: 'AAAAAAA',
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

      it('should create a EntidadeSaude', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new EntidadeSaude()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a EntidadeSaude', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            entidadeNome: 'BBBBBB',
            entidadeSetor: 'BBBBBB',
            entidadeEndereco: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a EntidadeSaude', () => {
        const patchObject = Object.assign(
          {
            entidadeNome: 'BBBBBB',
            entidadeSetor: 'BBBBBB',
          },
          new EntidadeSaude()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of EntidadeSaude', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            entidadeNome: 'BBBBBB',
            entidadeSetor: 'BBBBBB',
            entidadeEndereco: 'BBBBBB',
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

      it('should delete a EntidadeSaude', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEntidadeSaudeToCollectionIfMissing', () => {
        it('should add a EntidadeSaude to an empty array', () => {
          const entidadeSaude: IEntidadeSaude = { id: 'ABC' };
          expectedResult = service.addEntidadeSaudeToCollectionIfMissing([], entidadeSaude);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(entidadeSaude);
        });

        it('should not add a EntidadeSaude to an array that contains it', () => {
          const entidadeSaude: IEntidadeSaude = { id: 'ABC' };
          const entidadeSaudeCollection: IEntidadeSaude[] = [
            {
              ...entidadeSaude,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addEntidadeSaudeToCollectionIfMissing(entidadeSaudeCollection, entidadeSaude);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a EntidadeSaude to an array that doesn't contain it", () => {
          const entidadeSaude: IEntidadeSaude = { id: 'ABC' };
          const entidadeSaudeCollection: IEntidadeSaude[] = [{ id: 'CBA' }];
          expectedResult = service.addEntidadeSaudeToCollectionIfMissing(entidadeSaudeCollection, entidadeSaude);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(entidadeSaude);
        });

        it('should add only unique EntidadeSaude to an array', () => {
          const entidadeSaudeArray: IEntidadeSaude[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Toalhas array synthesizing' }];
          const entidadeSaudeCollection: IEntidadeSaude[] = [{ id: 'ABC' }];
          expectedResult = service.addEntidadeSaudeToCollectionIfMissing(entidadeSaudeCollection, ...entidadeSaudeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const entidadeSaude: IEntidadeSaude = { id: 'ABC' };
          const entidadeSaude2: IEntidadeSaude = { id: 'CBA' };
          expectedResult = service.addEntidadeSaudeToCollectionIfMissing([], entidadeSaude, entidadeSaude2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(entidadeSaude);
          expect(expectedResult).toContain(entidadeSaude2);
        });

        it('should accept null and undefined values', () => {
          const entidadeSaude: IEntidadeSaude = { id: 'ABC' };
          expectedResult = service.addEntidadeSaudeToCollectionIfMissing([], null, entidadeSaude, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(entidadeSaude);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
