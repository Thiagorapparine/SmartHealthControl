import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IConsultasAgenda, ConsultasAgenda } from '../consultas-agenda.model';

import { ConsultasAgendaService } from './consultas-agenda.service';

describe('Service Tests', () => {
  describe('ConsultasAgenda Service', () => {
    let service: ConsultasAgendaService;
    let httpMock: HttpTestingController;
    let elemDefault: IConsultasAgenda;
    let expectedResult: IConsultasAgenda | IConsultasAgenda[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ConsultasAgendaService);
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

      it('should create a ConsultasAgenda', () => {
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

        service.create(new ConsultasAgenda()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ConsultasAgenda', () => {
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

      it('should partial update a ConsultasAgenda', () => {
        const patchObject = Object.assign(
          {
            agendamentoData: currentDate.format(DATE_TIME_FORMAT),
          },
          new ConsultasAgenda()
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

      it('should return a list of ConsultasAgenda', () => {
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

      it('should delete a ConsultasAgenda', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addConsultasAgendaToCollectionIfMissing', () => {
        it('should add a ConsultasAgenda to an empty array', () => {
          const consultasAgenda: IConsultasAgenda = { id: 'ABC' };
          expectedResult = service.addConsultasAgendaToCollectionIfMissing([], consultasAgenda);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(consultasAgenda);
        });

        it('should not add a ConsultasAgenda to an array that contains it', () => {
          const consultasAgenda: IConsultasAgenda = { id: 'ABC' };
          const consultasAgendaCollection: IConsultasAgenda[] = [
            {
              ...consultasAgenda,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addConsultasAgendaToCollectionIfMissing(consultasAgendaCollection, consultasAgenda);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ConsultasAgenda to an array that doesn't contain it", () => {
          const consultasAgenda: IConsultasAgenda = { id: 'ABC' };
          const consultasAgendaCollection: IConsultasAgenda[] = [{ id: 'CBA' }];
          expectedResult = service.addConsultasAgendaToCollectionIfMissing(consultasAgendaCollection, consultasAgenda);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(consultasAgenda);
        });

        it('should add only unique ConsultasAgenda to an array', () => {
          const consultasAgendaArray: IConsultasAgenda[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Rua' }];
          const consultasAgendaCollection: IConsultasAgenda[] = [{ id: 'ABC' }];
          expectedResult = service.addConsultasAgendaToCollectionIfMissing(consultasAgendaCollection, ...consultasAgendaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const consultasAgenda: IConsultasAgenda = { id: 'ABC' };
          const consultasAgenda2: IConsultasAgenda = { id: 'CBA' };
          expectedResult = service.addConsultasAgendaToCollectionIfMissing([], consultasAgenda, consultasAgenda2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(consultasAgenda);
          expect(expectedResult).toContain(consultasAgenda2);
        });

        it('should accept null and undefined values', () => {
          const consultasAgenda: IConsultasAgenda = { id: 'ABC' };
          expectedResult = service.addConsultasAgendaToCollectionIfMissing([], null, consultasAgenda, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(consultasAgenda);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
