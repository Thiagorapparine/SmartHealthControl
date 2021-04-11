jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUsuariosSaude, UsuariosSaude } from '../usuarios-saude.model';
import { UsuariosSaudeService } from '../service/usuarios-saude.service';

import { UsuariosSaudeRoutingResolveService } from './usuarios-saude-routing-resolve.service';

describe('Service Tests', () => {
  describe('UsuariosSaude routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: UsuariosSaudeRoutingResolveService;
    let service: UsuariosSaudeService;
    let resultUsuariosSaude: IUsuariosSaude | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(UsuariosSaudeRoutingResolveService);
      service = TestBed.inject(UsuariosSaudeService);
      resultUsuariosSaude = undefined;
    });

    describe('resolve', () => {
      it('should return IUsuariosSaude returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUsuariosSaude = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultUsuariosSaude).toEqual({ id: 'ABC' });
      });

      it('should return new IUsuariosSaude if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUsuariosSaude = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultUsuariosSaude).toEqual(new UsuariosSaude());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUsuariosSaude = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultUsuariosSaude).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
