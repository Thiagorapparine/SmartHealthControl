import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExamesAgenda, getExamesAgendaIdentifier } from '../exames-agenda.model';

export type EntityResponseType = HttpResponse<IExamesAgenda>;
export type EntityArrayResponseType = HttpResponse<IExamesAgenda[]>;

@Injectable({ providedIn: 'root' })
export class ExamesAgendaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/exames-agenda');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(examesAgenda: IExamesAgenda): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(examesAgenda);
    return this.http
      .post<IExamesAgenda>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(examesAgenda: IExamesAgenda): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(examesAgenda);
    return this.http
      .put<IExamesAgenda>(`${this.resourceUrl}/${getExamesAgendaIdentifier(examesAgenda) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(examesAgenda: IExamesAgenda): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(examesAgenda);
    return this.http
      .patch<IExamesAgenda>(`${this.resourceUrl}/${getExamesAgendaIdentifier(examesAgenda) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IExamesAgenda>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExamesAgenda[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExamesAgendaToCollectionIfMissing(
    examesAgendaCollection: IExamesAgenda[],
    ...examesAgendaToCheck: (IExamesAgenda | null | undefined)[]
  ): IExamesAgenda[] {
    const examesAgenda: IExamesAgenda[] = examesAgendaToCheck.filter(isPresent);
    if (examesAgenda.length > 0) {
      const examesAgendaCollectionIdentifiers = examesAgendaCollection.map(
        examesAgendaItem => getExamesAgendaIdentifier(examesAgendaItem)!
      );
      const examesAgendaToAdd = examesAgenda.filter(examesAgendaItem => {
        const examesAgendaIdentifier = getExamesAgendaIdentifier(examesAgendaItem);
        if (examesAgendaIdentifier == null || examesAgendaCollectionIdentifiers.includes(examesAgendaIdentifier)) {
          return false;
        }
        examesAgendaCollectionIdentifiers.push(examesAgendaIdentifier);
        return true;
      });
      return [...examesAgendaToAdd, ...examesAgendaCollection];
    }
    return examesAgendaCollection;
  }

  protected convertDateFromClient(examesAgenda: IExamesAgenda): IExamesAgenda {
    return Object.assign({}, examesAgenda, {
      agendamentoData: examesAgenda.agendamentoData?.isValid() ? examesAgenda.agendamentoData.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.agendamentoData = res.body.agendamentoData ? dayjs(res.body.agendamentoData) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((examesAgenda: IExamesAgenda) => {
        examesAgenda.agendamentoData = examesAgenda.agendamentoData ? dayjs(examesAgenda.agendamentoData) : undefined;
      });
    }
    return res;
  }
}
