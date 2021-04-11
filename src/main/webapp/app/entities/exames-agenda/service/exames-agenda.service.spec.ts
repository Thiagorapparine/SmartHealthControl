import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IExamesAgenda, ExamesAgenda } from '../exames-agenda.model';

import { ExamesAgendaService } from './exames-agenda.service';

describe('Service Tests', () => {
  describe('ExamesAgenda Service', () => {
    let service: ExamesAgendaService;
    let httpMock: HttpTestingController;
    let elemDefault: IExamesAgenda;
    let expectedResult: IExamesAgenda | IExamesAgenda[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ExamesAgendaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        agendamentoData: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            agendamentoData: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ExamesAgenda', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            agendamentoData: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            agendamentoData: currentDate,
          },
          returnedFromService
        );

        service.create(new ExamesAgenda()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ExamesAgenda', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            agendamentoData: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            agendamentoData: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ExamesAgenda', () => {
        const patchObject = Object.assign(
          {
            agendamentoData: currentDate.format(DATE_TIME_FORMAT),
          },
          new ExamesAgenda()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            agendamentoData: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ExamesAgenda', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            agendamentoData: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            agendamentoData: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ExamesAgenda', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addExamesAgendaToCollectionIfMissing', () => {
        it('should add a ExamesAgenda to an empty array', () => {
          const examesAgenda: IExamesAgenda = { id: 'ABC' };
          expectedResult = service.addExamesAgendaToCollectionIfMissing([], examesAgenda);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(examesAgenda);
        });

        it('should not add a ExamesAgenda to an array that contains it', () => {
          const examesAgenda: IExamesAgenda = { id: 'ABC' };
          const examesAgendaCollection: IExamesAgenda[] = [
            {
              ...examesAgenda,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addExamesAgendaToCollectionIfMissing(examesAgendaCollection, examesAgenda);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ExamesAgenda to an array that doesn't contain it", () => {
          const examesAgenda: IExamesAgenda = { id: 'ABC' };
          const examesAgendaCollection: IExamesAgenda[] = [{ id: 'CBA' }];
          expectedResult = service.addExamesAgendaToCollectionIfMissing(examesAgendaCollection, examesAgenda);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(examesAgenda);
        });

        it('should add only unique ExamesAgenda to an array', () => {
          const examesAgendaArray: IExamesAgenda[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Acre Robust Vision-oriented' }];
          const examesAgendaCollection: IExamesAgenda[] = [{ id: 'ABC' }];
          expectedResult = service.addExamesAgendaToCollectionIfMissing(examesAgendaCollection, ...examesAgendaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const examesAgenda: IExamesAgenda = { id: 'ABC' };
          const examesAgenda2: IExamesAgenda = { id: 'CBA' };
          expectedResult = service.addExamesAgendaToCollectionIfMissing([], examesAgenda, examesAgenda2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(examesAgenda);
          expect(expectedResult).toContain(examesAgenda2);
        });

        it('should accept null and undefined values', () => {
          const examesAgenda: IExamesAgenda = { id: 'ABC' };
          expectedResult = service.addExamesAgendaToCollectionIfMissing([], null, examesAgenda, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(examesAgenda);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
