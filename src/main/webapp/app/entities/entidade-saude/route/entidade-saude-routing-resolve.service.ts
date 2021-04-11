import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEntidadeSaude, EntidadeSaude } from '../entidade-saude.model';
import { EntidadeSaudeService } from '../service/entidade-saude.service';

@Injectable({ providedIn: 'root' })
export class EntidadeSaudeRoutingResolveService implements Resolve<IEntidadeSaude> {
  constructor(protected service: EntidadeSaudeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEntidadeSaude> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((entidadeSaude: HttpResponse<EntidadeSaude>) => {
          if (entidadeSaude.body) {
            return of(entidadeSaude.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EntidadeSaude());
  }
}
