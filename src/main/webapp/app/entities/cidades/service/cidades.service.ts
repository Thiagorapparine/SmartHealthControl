import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICidades, getCidadesIdentifier } from '../cidades.model';

export type EntityResponseType = HttpResponse<ICidades>;
export type EntityArrayResponseType = HttpResponse<ICidades[]>;

@Injectable({ providedIn: 'root' })
export class CidadesService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/cidades');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(cidades: ICidades): Observable<EntityResponseType> {
    return this.http.post<ICidades>(this.resourceUrl, cidades, { observe: 'response' });
  }

  update(cidades: ICidades): Observable<EntityResponseType> {
    return this.http.put<ICidades>(`${this.resourceUrl}/${getCidadesIdentifier(cidades) as string}`, cidades, { observe: 'response' });
  }

  partialUpdate(cidades: ICidades): Observable<EntityResponseType> {
    return this.http.patch<ICidades>(`${this.resourceUrl}/${getCidadesIdentifier(cidades) as string}`, cidades, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ICidades>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICidades[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCidadesToCollectionIfMissing(cidadesCollection: ICidades[], ...cidadesToCheck: (ICidades | null | undefined)[]): ICidades[] {
    const cidades: ICidades[] = cidadesToCheck.filter(isPresent);
    if (cidades.length > 0) {
      const cidadesCollectionIdentifiers = cidadesCollection.map(cidadesItem => getCidadesIdentifier(cidadesItem)!);
      const cidadesToAdd = cidades.filter(cidadesItem => {
        const cidadesIdentifier = getCidadesIdentifier(cidadesItem);
        if (cidadesIdentifier == null || cidadesCollectionIdentifiers.includes(cidadesIdentifier)) {
          return false;
        }
        cidadesCollectionIdentifiers.push(cidadesIdentifier);
        return true;
      });
      return [...cidadesToAdd, ...cidadesCollection];
    }
    return cidadesCollection;
  }
}
