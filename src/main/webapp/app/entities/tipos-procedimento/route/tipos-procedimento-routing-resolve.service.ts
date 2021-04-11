import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITiposProcedimento, TiposProcedimento } from '../tipos-procedimento.model';
import { TiposProcedimentoService } from '../service/tipos-procedimento.service';

@Injectable({ providedIn: 'root' })
export class TiposProcedimentoRoutingResolveService implements Resolve<ITiposProcedimento> {
  constructor(protected service: TiposProcedimentoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITiposProcedimento> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tiposProcedimento: HttpResponse<TiposProcedimento>) => {
          if (tiposProcedimento.body) {
            return of(tiposProcedimento.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TiposProcedimento());
  }
}
