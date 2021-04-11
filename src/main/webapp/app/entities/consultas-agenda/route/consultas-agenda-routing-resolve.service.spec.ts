jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IConsultasAgenda, ConsultasAgenda } from '../consultas-agenda.model';
import { ConsultasAgendaService } from '../service/consultas-agenda.service';

import { ConsultasAgendaRoutingResolveService } from './consultas-agenda-routing-resolve.service';

describe('Service Tests', () => {
  describe('ConsultasAgenda routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ConsultasAgendaRoutingResolveService;
    let service: ConsultasAgendaService;
    let resultConsultasAgenda: IConsultasAgenda | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ConsultasAgendaRoutingResolveService);
      service = TestBed.inject(ConsultasAgendaService);
      resultConsultasAgenda = undefined;
    });

    describe('resolve', () => {
      it('should return IConsultasAgenda returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConsultasAgenda = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultConsultasAgenda).toEqual({ id: 'ABC' });
      });

      it('should return new IConsultasAgenda if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConsultasAgenda = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultConsultasAgenda).toEqual(new ConsultasAgenda());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConsultasAgenda = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultConsultasAgenda).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
