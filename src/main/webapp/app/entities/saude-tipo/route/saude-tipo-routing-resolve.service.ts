import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISaudeTipo, SaudeTipo } from '../saude-tipo.model';
import { SaudeTipoService } from '../service/saude-tipo.service';

@Injectable({ providedIn: 'root' })
export class SaudeTipoRoutingResolveService implements Resolve<ISaudeTipo> {
  constructor(protected service: SaudeTipoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISaudeTipo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((saudeTipo: HttpResponse<SaudeTipo>) => {
          if (saudeTipo.body) {
            return of(saudeTipo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SaudeTipo());
  }
}
