jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISetorSaude, SetorSaude } from '../setor-saude.model';
import { SetorSaudeService } from '../service/setor-saude.service';

import { SetorSaudeRoutingResolveService } from './setor-saude-routing-resolve.service';

describe('Service Tests', () => {
  describe('SetorSaude routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SetorSaudeRoutingResolveService;
    let service: SetorSaudeService;
    let resultSetorSaude: ISetorSaude | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SetorSaudeRoutingResolveService);
      service = TestBed.inject(SetorSaudeService);
      resultSetorSaude = undefined;
    });

    describe('resolve', () => {
      it('should return ISetorSaude returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSetorSaude = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSetorSaude).toEqual({ id: 'ABC' });
      });

      it('should return new ISetorSaude if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSetorSaude = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSetorSaude).toEqual(new SetorSaude());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSetorSaude = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSetorSaude).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
