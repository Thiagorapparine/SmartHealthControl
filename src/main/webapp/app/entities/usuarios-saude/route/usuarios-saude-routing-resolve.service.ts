import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUsuariosSaude, UsuariosSaude } from '../usuarios-saude.model';
import { UsuariosSaudeService } from '../service/usuarios-saude.service';

@Injectable({ providedIn: 'root' })
export class UsuariosSaudeRoutingResolveService implements Resolve<IUsuariosSaude> {
  constructor(protected service: UsuariosSaudeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUsuariosSaude> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((usuariosSaude: HttpResponse<UsuariosSaude>) => {
          if (usuariosSaude.body) {
            return of(usuariosSaude.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UsuariosSaude());
  }
}
