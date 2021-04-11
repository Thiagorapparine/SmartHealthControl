import * as dayjs from 'dayjs';
import { ITiposProcedimento } from 'app/entities/tipos-procedimento/tipos-procedimento.model';
import { IEntidadeSaude } from 'app/entities/entidade-saude/entidade-saude.model';

export interface IExamesAgenda {
  id?: string;
  agendamentoData?: dayjs.Dayjs;
  tiposProcedimento?: ITiposProcedimento | null;
  entidadeSaude?: IEntidadeSaude | null;
}

export class ExamesAgenda implements IExamesAgenda {
  constructor(
    public id?: string,
    public agendamentoData?: dayjs.Dayjs,
    public tiposProcedimento?: ITiposProcedimento | null,
    public entidadeSaude?: IEntidadeSaude | null
  ) {}
}

export function getExamesAgendaIdentifier(examesAgenda: IExamesAgenda): string | undefined {
  return examesAgenda.id;
}
