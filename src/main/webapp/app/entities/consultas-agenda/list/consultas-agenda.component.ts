import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsultasAgenda } from '../consultas-agenda.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ConsultasAgendaService } from '../service/consultas-agenda.service';
import { ConsultasAgendaDeleteDialogComponent } from '../delete/consultas-agenda-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-consultas-agenda',
  templateUrl: './consultas-agenda.component.html',
})
export class ConsultasAgendaComponent implements OnInit {
  consultasAgenda: IConsultasAgenda[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected consultasAgendaService: ConsultasAgendaService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks
  ) {
    this.consultasAgenda = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.consultasAgendaService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IConsultasAgenda[]>) => {
          this.isLoading = false;
          this.paginateConsultasAgenda(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.consultasAgenda = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IConsultasAgenda): string {
    return item.id!;
  }

  delete(consultasAgenda: IConsultasAgenda): void {
    const modalRef = this.modalService.open(ConsultasAgendaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.consultasAgenda = consultasAgenda;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateConsultasAgenda(data: IConsultasAgenda[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.consultasAgenda.push(d);
      }
    }
  }
}
