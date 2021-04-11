import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConsultasAgenda, ConsultasAgenda } from '../consultas-agenda.model';
import { ConsultasAgendaService } from '../service/consultas-agenda.service';

@Injectable({ providedIn: 'root' })
export class ConsultasAgendaRoutingResolveService implements Resolve<IConsultasAgenda> {
  constructor(protected service: ConsultasAgendaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConsultasAgenda> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((consultasAgenda: HttpResponse<ConsultasAgenda>) => {
          if (consultasAgenda.body) {
            return of(consultasAgenda.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ConsultasAgenda());
  }
}
