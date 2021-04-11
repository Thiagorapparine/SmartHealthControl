import * as dayjs from 'dayjs';
import { IUsuariosSaude } from 'app/entities/usuarios-saude/usuarios-saude.model';
import { ISetorSaude } from 'app/entities/setor-saude/setor-saude.model';
import { IEntidadeSaude } from 'app/entities/entidade-saude/entidade-saude.model';

export interface IConsultasAgenda {
  id?: string;
  agendamentoData?: dayjs.Dayjs;
  usuariosSaude?: IUsuariosSaude | null;
  setorSaude?: ISetorSaude | null;
  entidadeSaude?: IEntidadeSaude | null;
}

export class ConsultasAgenda implements IConsultasAgenda {
  constructor(
    public id?: string,
    public agendamentoData?: dayjs.Dayjs,
    public usuariosSaude?: IUsuariosSaude | null,
    public setorSaude?: ISetorSaude | null,
    public entidadeSaude?: IEntidadeSaude | null
  ) {}
}

export function getConsultasAgendaIdentifier(consultasAgenda: IConsultasAgenda): string | undefined {
  return consultasAgenda.id;
}
