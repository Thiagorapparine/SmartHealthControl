import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISaudeTipo, getSaudeTipoIdentifier } from '../saude-tipo.model';

export type EntityResponseType = HttpResponse<ISaudeTipo>;
export type EntityArrayResponseType = HttpResponse<ISaudeTipo[]>;

@Injectable({ providedIn: 'root' })
export class SaudeTipoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/saude-tipos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(saudeTipo: ISaudeTipo): Observable<EntityResponseType> {
    return this.http.post<ISaudeTipo>(this.resourceUrl, saudeTipo, { observe: 'response' });
  }

  update(saudeTipo: ISaudeTipo): Observable<EntityResponseType> {
    return this.http.put<ISaudeTipo>(`${this.resourceUrl}/${getSaudeTipoIdentifier(saudeTipo) as string}`, saudeTipo, {
      observe: 'response',
    });
  }

  partialUpdate(saudeTipo: ISaudeTipo): Observable<EntityResponseType> {
    return this.http.patch<ISaudeTipo>(`${this.resourceUrl}/${getSaudeTipoIdentifier(saudeTipo) as string}`, saudeTipo, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISaudeTipo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISaudeTipo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSaudeTipoToCollectionIfMissing(
    saudeTipoCollection: ISaudeTipo[],
    ...saudeTiposToCheck: (ISaudeTipo | null | undefined)[]
  ): ISaudeTipo[] {
    const saudeTipos: ISaudeTipo[] = saudeTiposToCheck.filter(isPresent);
    if (saudeTipos.length > 0) {
      const saudeTipoCollectionIdentifiers = saudeTipoCollection.map(saudeTipoItem => getSaudeTipoIdentifier(saudeTipoItem)!);
      const saudeTiposToAdd = saudeTipos.filter(saudeTipoItem => {
        const saudeTipoIdentifier = getSaudeTipoIdentifier(saudeTipoItem);
        if (saudeTipoIdentifier == null || saudeTipoCollectionIdentifiers.includes(saudeTipoIdentifier)) {
          return false;
        }
        saudeTipoCollectionIdentifiers.push(saudeTipoIdentifier);
        return true;
      });
      return [...saudeTiposToAdd, ...saudeTipoCollection];
    }
    return saudeTipoCollection;
  }
}
