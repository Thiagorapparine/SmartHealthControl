import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICidades, Cidades } from '../cidades.model';
import { CidadesService } from '../service/cidades.service';

@Injectable({ providedIn: 'root' })
export class CidadesRoutingResolveService implements Resolve<ICidades> {
  constructor(protected service: CidadesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICidades> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cidades: HttpResponse<Cidades>) => {
          if (cidades.body) {
            return of(cidades.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cidades());
  }
}
