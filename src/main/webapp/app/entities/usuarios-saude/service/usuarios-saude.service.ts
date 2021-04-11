import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUsuariosSaude, getUsuariosSaudeIdentifier } from '../usuarios-saude.model';

export type EntityResponseType = HttpResponse<IUsuariosSaude>;
export type EntityArrayResponseType = HttpResponse<IUsuariosSaude[]>;

@Injectable({ providedIn: 'root' })
export class UsuariosSaudeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/usuarios-saudes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(usuariosSaude: IUsuariosSaude): Observable<EntityResponseType> {
    return this.http.post<IUsuariosSaude>(this.resourceUrl, usuariosSaude, { observe: 'response' });
  }

  update(usuariosSaude: IUsuariosSaude): Observable<EntityResponseType> {
    return this.http.put<IUsuariosSaude>(`${this.resourceUrl}/${getUsuariosSaudeIdentifier(usuariosSaude) as string}`, usuariosSaude, {
      observe: 'response',
    });
  }

  partialUpdate(usuariosSaude: IUsuariosSaude): Observable<EntityResponseType> {
    return this.http.patch<IUsuariosSaude>(`${this.resourceUrl}/${getUsuariosSaudeIdentifier(usuariosSaude) as string}`, usuariosSaude, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IUsuariosSaude>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUsuariosSaude[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUsuariosSaudeToCollectionIfMissing(
    usuariosSaudeCollection: IUsuariosSaude[],
    ...usuariosSaudesToCheck: (IUsuariosSaude | null | undefined)[]
  ): IUsuariosSaude[] {
    const usuariosSaudes: IUsuariosSaude[] = usuariosSaudesToCheck.filter(isPresent);
    if (usuariosSaudes.length > 0) {
      const usuariosSaudeCollectionIdentifiers = usuariosSaudeCollection.map(
        usuariosSaudeItem => getUsuariosSaudeIdentifier(usuariosSaudeItem)!
      );
      const usuariosSaudesToAdd = usuariosSaudes.filter(usuariosSaudeItem => {
        const usuariosSaudeIdentifier = getUsuariosSaudeIdentifier(usuariosSaudeItem);
        if (usuariosSaudeIdentifier == null || usuariosSaudeCollectionIdentifiers.includes(usuariosSaudeIdentifier)) {
          return false;
        }
        usuariosSaudeCollectionIdentifiers.push(usuariosSaudeIdentifier);
        return true;
      });
      return [...usuariosSaudesToAdd, ...usuariosSaudeCollection];
    }
    return usuariosSaudeCollection;
  }
}
