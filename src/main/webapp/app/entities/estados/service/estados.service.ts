import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstados, getEstadosIdentifier } from '../estados.model';

export type EntityResponseType = HttpResponse<IEstados>;
export type EntityArrayResponseType = HttpResponse<IEstados[]>;

@Injectable({ providedIn: 'root' })
export class EstadosService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/estados');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(estados: IEstados): Observable<EntityResponseType> {
    return this.http.post<IEstados>(this.resourceUrl, estados, { observe: 'response' });
  }

  update(estados: IEstados): Observable<EntityResponseType> {
    return this.http.put<IEstados>(`${this.resourceUrl}/${getEstadosIdentifier(estados) as string}`, estados, { observe: 'response' });
  }

  partialUpdate(estados: IEstados): Observable<EntityResponseType> {
    return this.http.patch<IEstados>(`${this.resourceUrl}/${getEstadosIdentifier(estados) as string}`, estados, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IEstados>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstados[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEstadosToCollectionIfMissing(estadosCollection: IEstados[], ...estadosToCheck: (IEstados | null | undefined)[]): IEstados[] {
    const estados: IEstados[] = estadosToCheck.filter(isPresent);
    if (estados.length > 0) {
      const estadosCollectionIdentifiers = estadosCollection.map(estadosItem => getEstadosIdentifier(estadosItem)!);
      const estadosToAdd = estados.filter(estadosItem => {
        const estadosIdentifier = getEstadosIdentifier(estadosItem);
        if (estadosIdentifier == null || estadosCollectionIdentifiers.includes(estadosIdentifier)) {
          return false;
        }
        estadosCollectionIdentifiers.push(estadosIdentifier);
        return true;
      });
      return [...estadosToAdd, ...estadosCollection];
    }
    return estadosCollection;
  }
}
