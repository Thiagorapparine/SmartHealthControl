import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExamesAgenda, ExamesAgenda } from '../exames-agenda.model';
import { ExamesAgendaService } from '../service/exames-agenda.service';

@Injectable({ providedIn: 'root' })
export class ExamesAgendaRoutingResolveService implements Resolve<IExamesAgenda> {
  constructor(protected service: ExamesAgendaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExamesAgenda> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((examesAgenda: HttpResponse<ExamesAgenda>) => {
          if (examesAgenda.body) {
            return of(examesAgenda.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ExamesAgenda());
  }
}
