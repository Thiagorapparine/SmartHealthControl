import { ISaudeTipo } from 'app/entities/saude-tipo/saude-tipo.model';
import { IEstados } from 'app/entities/estados/estados.model';
import { ICidades } from 'app/entities/cidades/cidades.model';
import { ITiposProcedimento } from 'app/entities/tipos-procedimento/tipos-procedimento.model';
import { IProfissionais } from 'app/entities/profissionais/profissionais.model';
import { SetorEntidade } from 'app/entities/enumerations/setor-entidade.model';

export interface IEntidadeSaude {
  id?: string;
  entidadeNome?: string;
  entidadeSetor?: SetorEntidade;
  entidadeEndereco?: string;
  saudeTipo?: ISaudeTipo | null;
  estados?: IEstados | null;
  cidades?: ICidades | null;
  tiposProcedimentos?: ITiposProcedimento[] | null;
  profissionais?: IProfissionais[] | null;
}

export class EntidadeSaude implements IEntidadeSaude {
  constructor(
    public id?: string,
    public entidadeNome?: string,
    public entidadeSetor?: SetorEntidade,
    public entidadeEndereco?: string,
    public saudeTipo?: ISaudeTipo | null,
    public estados?: IEstados | null,
    public cidades?: ICidades | null,
    public tiposProcedimentos?: ITiposProcedimento[] | null,
    public profissionais?: IProfissionais[] | null
  ) {}
}

export function getEntidadeSaudeIdentifier(entidadeSaude: IEntidadeSaude): string | undefined {
  return entidadeSaude.id;
}
