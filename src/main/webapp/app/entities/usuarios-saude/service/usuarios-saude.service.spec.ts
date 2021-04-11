import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUsuariosSaude, UsuariosSaude } from '../usuarios-saude.model';

import { UsuariosSaudeService } from './usuarios-saude.service';

describe('Service Tests', () => {
  describe('UsuariosSaude Service', () => {
    let service: UsuariosSaudeService;
    let httpMock: HttpTestingController;
    let elemDefault: IUsuariosSaude;
    let expectedResult: IUsuariosSaude | IUsuariosSaude[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UsuariosSaudeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        usuarioFotoContentType: 'image/png',
        usuarioFoto: 'AAAAAAA',
        usuarioNome: 'AAAAAAA',
        usuarioCPF: 'AAAAAAA',
        usuarioDataNascimento: 'AAAAAAA',
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

      it('should create a UsuariosSaude', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new UsuariosSaude()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UsuariosSaude', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            usuarioFoto: 'BBBBBB',
            usuarioNome: 'BBBBBB',
            usuarioCPF: 'BBBBBB',
            usuarioDataNascimento: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UsuariosSaude', () => {
        const patchObject = Object.assign(
          {
            usuarioNome: 'BBBBBB',
            usuarioCPF: 'BBBBBB',
            usuarioDataNascimento: 'BBBBBB',
          },
          new UsuariosSaude()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UsuariosSaude', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            usuarioFoto: 'BBBBBB',
            usuarioNome: 'BBBBBB',
            usuarioCPF: 'BBBBBB',
            usuarioDataNascimento: 'BBBBBB',
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

      it('should delete a UsuariosSaude', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUsuariosSaudeToCollectionIfMissing', () => {
        it('should add a UsuariosSaude to an empty array', () => {
          const usuariosSaude: IUsuariosSaude = { id: 'ABC' };
          expectedResult = service.addUsuariosSaudeToCollectionIfMissing([], usuariosSaude);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(usuariosSaude);
        });

        it('should not add a UsuariosSaude to an array that contains it', () => {
          const usuariosSaude: IUsuariosSaude = { id: 'ABC' };
          const usuariosSaudeCollection: IUsuariosSaude[] = [
            {
              ...usuariosSaude,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addUsuariosSaudeToCollectionIfMissing(usuariosSaudeCollection, usuariosSaude);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UsuariosSaude to an array that doesn't contain it", () => {
          const usuariosSaude: IUsuariosSaude = { id: 'ABC' };
          const usuariosSaudeCollection: IUsuariosSaude[] = [{ id: 'CBA' }];
          expectedResult = service.addUsuariosSaudeToCollectionIfMissing(usuariosSaudeCollection, usuariosSaude);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(usuariosSaude);
        });

        it('should add only unique UsuariosSaude to an array', () => {
          const usuariosSaudeArray: IUsuariosSaude[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Salada unleash' }];
          const usuariosSaudeCollection: IUsuariosSaude[] = [{ id: 'ABC' }];
          expectedResult = service.addUsuariosSaudeToCollectionIfMissing(usuariosSaudeCollection, ...usuariosSaudeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const usuariosSaude: IUsuariosSaude = { id: 'ABC' };
          const usuariosSaude2: IUsuariosSaude = { id: 'CBA' };
          expectedResult = service.addUsuariosSaudeToCollectionIfMissing([], usuariosSaude, usuariosSaude2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(usuariosSaude);
          expect(expectedResult).toContain(usuariosSaude2);
        });

        it('should accept null and undefined values', () => {
          const usuariosSaude: IUsuariosSaude = { id: 'ABC' };
          expectedResult = service.addUsuariosSaudeToCollectionIfMissing([], null, usuariosSaude, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(usuariosSaude);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
