import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstados, Estados } from '../estados.model';
import { EstadosService } from '../service/estados.service';

@Injectable({ providedIn: 'root' })
export class EstadosRoutingResolveService implements Resolve<IEstados> {
  constructor(protected service: EstadosService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEstados> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((estados: HttpResponse<Estados>) => {
          if (estados.body) {
            return of(estados.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Estados());
  }
}
