import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfissionais, getProfissionaisIdentifier } from '../profissionais.model';

export type EntityResponseType = HttpResponse<IProfissionais>;
export type EntityArrayResponseType = HttpResponse<IProfissionais[]>;

@Injectable({ providedIn: 'root' })
export class ProfissionaisService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/profissionais');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(profissionais: IProfissionais): Observable<EntityResponseType> {
    return this.http.post<IProfissionais>(this.resourceUrl, profissionais, { observe: 'response' });
  }

  update(profissionais: IProfissionais): Observable<EntityResponseType> {
    return this.http.put<IProfissionais>(`${this.resourceUrl}/${getProfissionaisIdentifier(profissionais) as string}`, profissionais, {
      observe: 'response',
    });
  }

  partialUpdate(profissionais: IProfissionais): Observable<EntityResponseType> {
    return this.http.patch<IProfissionais>(`${this.resourceUrl}/${getProfissionaisIdentifier(profissionais) as string}`, profissionais, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IProfissionais>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProfissionais[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProfissionaisToCollectionIfMissing(
    profissionaisCollection: IProfissionais[],
    ...profissionaisToCheck: (IProfissionais | null | undefined)[]
  ): IProfissionais[] {
    const profissionais: IProfissionais[] = profissionaisToCheck.filter(isPresent);
    if (profissionais.length > 0) {
      const profissionaisCollectionIdentifiers = profissionaisCollection.map(
        profissionaisItem => getProfissionaisIdentifier(profissionaisItem)!
      );
      const profissionaisToAdd = profissionais.filter(profissionaisItem => {
        const profissionaisIdentifier = getProfissionaisIdentifier(profissionaisItem);
        if (profissionaisIdentifier == null || profissionaisCollectionIdentifiers.includes(profissionaisIdentifier)) {
          return false;
        }
        profissionaisCollectionIdentifiers.push(profissionaisIdentifier);
        return true;
      });
      return [...profissionaisToAdd, ...profissionaisCollection];
    }
    return profissionaisCollection;
  }
}
