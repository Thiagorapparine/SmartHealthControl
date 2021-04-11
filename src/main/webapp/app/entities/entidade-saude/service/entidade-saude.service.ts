import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEntidadeSaude, getEntidadeSaudeIdentifier } from '../entidade-saude.model';

export type EntityResponseType = HttpResponse<IEntidadeSaude>;
export type EntityArrayResponseType = HttpResponse<IEntidadeSaude[]>;

@Injectable({ providedIn: 'root' })
export class EntidadeSaudeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/entidade-saudes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(entidadeSaude: IEntidadeSaude): Observable<EntityResponseType> {
    return this.http.post<IEntidadeSaude>(this.resourceUrl, entidadeSaude, { observe: 'response' });
  }

  update(entidadeSaude: IEntidadeSaude): Observable<EntityResponseType> {
    return this.http.put<IEntidadeSaude>(`${this.resourceUrl}/${getEntidadeSaudeIdentifier(entidadeSaude) as string}`, entidadeSaude, {
      observe: 'response',
    });
  }

  partialUpdate(entidadeSaude: IEntidadeSaude): Observable<EntityResponseType> {
    return this.http.patch<IEntidadeSaude>(`${this.resourceUrl}/${getEntidadeSaudeIdentifier(entidadeSaude) as string}`, entidadeSaude, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IEntidadeSaude>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEntidadeSaude[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEntidadeSaudeToCollectionIfMissing(
    entidadeSaudeCollection: IEntidadeSaude[],
    ...entidadeSaudesToCheck: (IEntidadeSaude | null | undefined)[]
  ): IEntidadeSaude[] {
    const entidadeSaudes: IEntidadeSaude[] = entidadeSaudesToCheck.filter(isPresent);
    if (entidadeSaudes.length > 0) {
      const entidadeSaudeCollectionIdentifiers = entidadeSaudeCollection.map(
        entidadeSaudeItem => getEntidadeSaudeIdentifier(entidadeSaudeItem)!
      );
      const entidadeSaudesToAdd = entidadeSaudes.filter(entidadeSaudeItem => {
        const entidadeSaudeIdentifier = getEntidadeSaudeIdentifier(entidadeSaudeItem);
        if (entidadeSaudeIdentifier == null || entidadeSaudeCollectionIdentifiers.includes(entidadeSaudeIdentifier)) {
          return false;
        }
        entidadeSaudeCollectionIdentifiers.push(entidadeSaudeIdentifier);
        return true;
      });
      return [...entidadeSaudesToAdd, ...entidadeSaudeCollection];
    }
    return entidadeSaudeCollection;
  }
}
