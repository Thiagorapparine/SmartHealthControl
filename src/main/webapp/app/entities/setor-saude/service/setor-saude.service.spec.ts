import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISetorSaude, SetorSaude } from '../setor-saude.model';

import { SetorSaudeService } from './setor-saude.service';

describe('Service Tests', () => {
  describe('SetorSaude Service', () => {
    let service: SetorSaudeService;
    let httpMock: HttpTestingController;
    let elemDefault: ISetorSaude;
    let expectedResult: ISetorSaude | ISetorSaude[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SetorSaudeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        setorSaude: 'AAAAAAA',
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

      it('should create a SetorSaude', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new SetorSaude()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SetorSaude', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            setorSaude: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SetorSaude', () => {
        const patchObject = Object.assign({}, new SetorSaude());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SetorSaude', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            setorSaude: 'BBBBBB',
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

      it('should delete a SetorSaude', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSetorSaudeToCollectionIfMissing', () => {
        it('should add a SetorSaude to an empty array', () => {
          const setorSaude: ISetorSaude = { id: 'ABC' };
          expectedResult = service.addSetorSaudeToCollectionIfMissing([], setorSaude);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(setorSaude);
        });

        it('should not add a SetorSaude to an array that contains it', () => {
          const setorSaude: ISetorSaude = { id: 'ABC' };
          const setorSaudeCollection: ISetorSaude[] = [
            {
              ...setorSaude,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addSetorSaudeToCollectionIfMissing(setorSaudeCollection, setorSaude);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SetorSaude to an array that doesn't contain it", () => {
          const setorSaude: ISetorSaude = { id: 'ABC' };
          const setorSaudeCollection: ISetorSaude[] = [{ id: 'CBA' }];
          expectedResult = service.addSetorSaudeToCollectionIfMissing(setorSaudeCollection, setorSaude);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(setorSaude);
        });

        it('should add only unique SetorSaude to an array', () => {
          const setorSaudeArray: ISetorSaude[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Producer sensor' }];
          const setorSaudeCollection: ISetorSaude[] = [{ id: 'ABC' }];
          expectedResult = service.addSetorSaudeToCollectionIfMissing(setorSaudeCollection, ...setorSaudeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const setorSaude: ISetorSaude = { id: 'ABC' };
          const setorSaude2: ISetorSaude = { id: 'CBA' };
          expectedResult = service.addSetorSaudeToCollectionIfMissing([], setorSaude, setorSaude2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(setorSaude);
          expect(expectedResult).toContain(setorSaude2);
        });

        it('should accept null and undefined values', () => {
          const setorSaude: ISetorSaude = { id: 'ABC' };
          expectedResult = service.addSetorSaudeToCollectionIfMissing([], null, setorSaude, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(setorSaude);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
