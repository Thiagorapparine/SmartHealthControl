jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEstados, Estados } from '../estados.model';
import { EstadosService } from '../service/estados.service';

import { EstadosRoutingResolveService } from './estados-routing-resolve.service';

describe('Service Tests', () => {
  describe('Estados routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EstadosRoutingResolveService;
    let service: EstadosService;
    let resultEstados: IEstados | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EstadosRoutingResolveService);
      service = TestBed.inject(EstadosService);
      resultEstados = undefined;
    });

    describe('resolve', () => {
      it('should return IEstados returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEstados = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultEstados).toEqual({ id: 'ABC' });
      });

      it('should return new IEstados if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEstados = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEstados).toEqual(new Estados());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEstados = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultEstados).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
