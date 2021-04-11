import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProfissionais, Profissionais } from '../profissionais.model';
import { ProfissionaisService } from '../service/profissionais.service';

@Injectable({ providedIn: 'root' })
export class ProfissionaisRoutingResolveService implements Resolve<IProfissionais> {
  constructor(protected service: ProfissionaisService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProfissionais> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((profissionais: HttpResponse<Profissionais>) => {
          if (profissionais.body) {
            return of(profissionais.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Profissionais());
  }
}
