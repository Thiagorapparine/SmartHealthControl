jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITiposProcedimento, TiposProcedimento } from '../tipos-procedimento.model';
import { TiposProcedimentoService } from '../service/tipos-procedimento.service';

import { TiposProcedimentoRoutingResolveService } from './tipos-procedimento-routing-resolve.service';

describe('Service Tests', () => {
  describe('TiposProcedimento routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TiposProcedimentoRoutingResolveService;
    let service: TiposProcedimentoService;
    let resultTiposProcedimento: ITiposProcedimento | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TiposProcedimentoRoutingResolveService);
      service = TestBed.inject(TiposProcedimentoService);
      resultTiposProcedimento = undefined;
    });

    describe('resolve', () => {
      it('should return ITiposProcedimento returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTiposProcedimento = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultTiposProcedimento).toEqual({ id: 'ABC' });
      });

      it('should return new ITiposProcedimento if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTiposProcedimento = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTiposProcedimento).toEqual(new TiposProcedimento());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTiposProcedimento = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultTiposProcedimento).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
