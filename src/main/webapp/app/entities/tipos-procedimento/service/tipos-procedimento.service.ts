import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITiposProcedimento, getTiposProcedimentoIdentifier } from '../tipos-procedimento.model';

export type EntityResponseType = HttpResponse<ITiposProcedimento>;
export type EntityArrayResponseType = HttpResponse<ITiposProcedimento[]>;

@Injectable({ providedIn: 'root' })
export class TiposProcedimentoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/tipos-procedimentos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(tiposProcedimento: ITiposProcedimento): Observable<EntityResponseType> {
    return this.http.post<ITiposProcedimento>(this.resourceUrl, tiposProcedimento, { observe: 'response' });
  }

  update(tiposProcedimento: ITiposProcedimento): Observable<EntityResponseType> {
    return this.http.put<ITiposProcedimento>(
      `${this.resourceUrl}/${getTiposProcedimentoIdentifier(tiposProcedimento) as string}`,
      tiposProcedimento,
      { observe: 'response' }
    );
  }

  partialUpdate(tiposProcedimento: ITiposProcedimento): Observable<EntityResponseType> {
    return this.http.patch<ITiposProcedimento>(
      `${this.resourceUrl}/${getTiposProcedimentoIdentifier(tiposProcedimento) as string}`,
      tiposProcedimento,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ITiposProcedimento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITiposProcedimento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTiposProcedimentoToCollectionIfMissing(
    tiposProcedimentoCollection: ITiposProcedimento[],
    ...tiposProcedimentosToCheck: (ITiposProcedimento | null | undefined)[]
  ): ITiposProcedimento[] {
    const tiposProcedimentos: ITiposProcedimento[] = tiposProcedimentosToCheck.filter(isPresent);
    if (tiposProcedimentos.length > 0) {
      const tiposProcedimentoCollectionIdentifiers = tiposProcedimentoCollection.map(
        tiposProcedimentoItem => getTiposProcedimentoIdentifier(tiposProcedimentoItem)!
      );
      const tiposProcedimentosToAdd = tiposProcedimentos.filter(tiposProcedimentoItem => {
        const tiposProcedimentoIdentifier = getTiposProcedimentoIdentifier(tiposProcedimentoItem);
        if (tiposProcedimentoIdentifier == null || tiposProcedimentoCollectionIdentifiers.includes(tiposProcedimentoIdentifier)) {
          return false;
        }
        tiposProcedimentoCollectionIdentifiers.push(tiposProcedimentoIdentifier);
        return true;
      });
      return [...tiposProcedimentosToAdd, ...tiposProcedimentoCollection];
    }
    return tiposProcedimentoCollection;
  }
}
