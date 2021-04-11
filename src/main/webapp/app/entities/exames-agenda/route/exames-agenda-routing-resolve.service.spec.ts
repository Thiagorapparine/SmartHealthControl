jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IExamesAgenda, ExamesAgenda } from '../exames-agenda.model';
import { ExamesAgendaService } from '../service/exames-agenda.service';

import { ExamesAgendaRoutingResolveService } from './exames-agenda-routing-resolve.service';

describe('Service Tests', () => {
  describe('ExamesAgenda routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ExamesAgendaRoutingResolveService;
    let service: ExamesAgendaService;
    let resultExamesAgenda: IExamesAgenda | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ExamesAgendaRoutingResolveService);
      service = TestBed.inject(ExamesAgendaService);
      resultExamesAgenda = undefined;
    });

    describe('resolve', () => {
      it('should return IExamesAgenda returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExamesAgenda = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultExamesAgenda).toEqual({ id: 'ABC' });
      });

      it('should return new IExamesAgenda if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExamesAgenda = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultExamesAgenda).toEqual(new ExamesAgenda());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExamesAgenda = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultExamesAgenda).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
