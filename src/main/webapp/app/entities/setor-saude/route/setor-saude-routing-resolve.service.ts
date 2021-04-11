import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISetorSaude, SetorSaude } from '../setor-saude.model';
import { SetorSaudeService } from '../service/setor-saude.service';

@Injectable({ providedIn: 'root' })
export class SetorSaudeRoutingResolveService implements Resolve<ISetorSaude> {
  constructor(protected service: SetorSaudeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISetorSaude> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((setorSaude: HttpResponse<SetorSaude>) => {
          if (setorSaude.body) {
            return of(setorSaude.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SetorSaude());
  }
}
