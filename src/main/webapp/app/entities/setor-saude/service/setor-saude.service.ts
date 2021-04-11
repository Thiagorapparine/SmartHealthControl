import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISetorSaude, getSetorSaudeIdentifier } from '../setor-saude.model';

export type EntityResponseType = HttpResponse<ISetorSaude>;
export type EntityArrayResponseType = HttpResponse<ISetorSaude[]>;

@Injectable({ providedIn: 'root' })
export class SetorSaudeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/setor-saudes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(setorSaude: ISetorSaude): Observable<EntityResponseType> {
    return this.http.post<ISetorSaude>(this.resourceUrl, setorSaude, { observe: 'response' });
  }

  update(setorSaude: ISetorSaude): Observable<EntityResponseType> {
    return this.http.put<ISetorSaude>(`${this.resourceUrl}/${getSetorSaudeIdentifier(setorSaude) as string}`, setorSaude, {
      observe: 'response',
    });
  }

  partialUpdate(setorSaude: ISetorSaude): Observable<EntityResponseType> {
    return this.http.patch<ISetorSaude>(`${this.resourceUrl}/${getSetorSaudeIdentifier(setorSaude) as string}`, setorSaude, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISetorSaude>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISetorSaude[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSetorSaudeToCollectionIfMissing(
    setorSaudeCollection: ISetorSaude[],
    ...setorSaudesToCheck: (ISetorSaude | null | undefined)[]
  ): ISetorSaude[] {
    const setorSaudes: ISetorSaude[] = setorSaudesToCheck.filter(isPresent);
    if (setorSaudes.length > 0) {
      const setorSaudeCollectionIdentifiers = setorSaudeCollection.map(setorSaudeItem => getSetorSaudeIdentifier(setorSaudeItem)!);
      const setorSaudesToAdd = setorSaudes.filter(setorSaudeItem => {
        const setorSaudeIdentifier = getSetorSaudeIdentifier(setorSaudeItem);
        if (setorSaudeIdentifier == null || setorSaudeCollectionIdentifiers.includes(setorSaudeIdentifier)) {
          return false;
        }
        setorSaudeCollectionIdentifiers.push(setorSaudeIdentifier);
        return true;
      });
      return [...setorSaudesToAdd, ...setorSaudeCollection];
    }
    return setorSaudeCollection;
  }
}
