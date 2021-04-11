jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISaudeTipo, SaudeTipo } from '../saude-tipo.model';
import { SaudeTipoService } from '../service/saude-tipo.service';

import { SaudeTipoRoutingResolveService } from './saude-tipo-routing-resolve.service';

describe('Service Tests', () => {
  describe('SaudeTipo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SaudeTipoRoutingResolveService;
    let service: SaudeTipoService;
    let resultSaudeTipo: ISaudeTipo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SaudeTipoRoutingResolveService);
      service = TestBed.inject(SaudeTipoService);
      resultSaudeTipo = undefined;
    });

    describe('resolve', () => {
      it('should return ISaudeTipo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSaudeTipo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSaudeTipo).toEqual({ id: 'ABC' });
      });

      it('should return new ISaudeTipo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSaudeTipo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSaudeTipo).toEqual(new SaudeTipo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSaudeTipo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSaudeTipo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
