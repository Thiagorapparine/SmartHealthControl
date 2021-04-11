import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConsultasAgenda, getConsultasAgendaIdentifier } from '../consultas-agenda.model';

export type EntityResponseType = HttpResponse<IConsultasAgenda>;
export type EntityArrayResponseType = HttpResponse<IConsultasAgenda[]>;

@Injectable({ providedIn: 'root' })
export class ConsultasAgendaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/consultas-agenda');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(consultasAgenda: IConsultasAgenda): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultasAgenda);
    return this.http
      .post<IConsultasAgenda>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(consultasAgenda: IConsultasAgenda): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultasAgenda);
    return this.http
      .put<IConsultasAgenda>(`${this.resourceUrl}/${getConsultasAgendaIdentifier(consultasAgenda) as string}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(consultasAgenda: IConsultasAgenda): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultasAgenda);
    return this.http
      .patch<IConsultasAgenda>(`${this.resourceUrl}/${getConsultasAgendaIdentifier(consultasAgenda) as string}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IConsultasAgenda>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IConsultasAgenda[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConsultasAgendaToCollectionIfMissing(
    consultasAgendaCollection: IConsultasAgenda[],
    ...consultasAgendaToCheck: (IConsultasAgenda | null | undefined)[]
  ): IConsultasAgenda[] {
    const consultasAgenda: IConsultasAgenda[] = consultasAgendaToCheck.filter(isPresent);
    if (consultasAgenda.length > 0) {
      const consultasAgendaCollectionIdentifiers = consultasAgendaCollection.map(
        consultasAgendaItem => getConsultasAgendaIdentifier(consultasAgendaItem)!
      );
      const consultasAgendaToAdd = consultasAgenda.filter(consultasAgendaItem => {
        const consultasAgendaIdentifier = getConsultasAgendaIdentifier(consultasAgendaItem);
        if (consultasAgendaIdentifier == null || consultasAgendaCollectionIdentifiers.includes(consultasAgendaIdentifier)) {
          return false;
        }
        consultasAgendaCollectionIdentifiers.push(consultasAgendaIdentifier);
        return true;
      });
      return [...consultasAgendaToAdd, ...consultasAgendaCollection];
    }
    return consultasAgendaCollection;
  }

  protected convertDateFromClient(consultasAgenda: IConsultasAgenda): IConsultasAgenda {
    return Object.assign({}, consultasAgenda, {
      agendamentoData: consultasAgenda.agendamentoData?.isValid() ? consultasAgenda.agendamentoData.toJSON() : undefined,
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
      res.body.forEach((consultasAgenda: IConsultasAgenda) => {
        consultasAgenda.agendamentoData = consultasAgenda.agendamentoData ? dayjs(consultasAgenda.agendamentoData) : undefined;
      });
    }
    return res;
  }
}
