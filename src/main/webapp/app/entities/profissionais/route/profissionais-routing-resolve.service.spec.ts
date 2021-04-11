jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProfissionais, Profissionais } from '../profissionais.model';
import { ProfissionaisService } from '../service/profissionais.service';

import { ProfissionaisRoutingResolveService } from './profissionais-routing-resolve.service';

describe('Service Tests', () => {
  describe('Profissionais routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProfissionaisRoutingResolveService;
    let service: ProfissionaisService;
    let resultProfissionais: IProfissionais | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProfissionaisRoutingResolveService);
      service = TestBed.inject(ProfissionaisService);
      resultProfissionais = undefined;
    });

    describe('resolve', () => {
      it('should return IProfissionais returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfissionais = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultProfissionais).toEqual({ id: 'ABC' });
      });

      it('should return new IProfissionais if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfissionais = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProfissionais).toEqual(new Profissionais());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfissionais = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultProfissionais).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
