import { ISetorSaude } from 'app/entities/setor-saude/setor-saude.model';
import { IEntidadeSaude } from 'app/entities/entidade-saude/entidade-saude.model';

export interface ITiposProcedimento {
  id?: string;
  procedimentoNome?: string;
  procedimentoDescricao?: string | null;
  setorSaude?: ISetorSaude | null;
  entidadeNomes?: IEntidadeSaude[] | null;
}

export class TiposProcedimento implements ITiposProcedimento {
  constructor(
    public id?: string,
    public procedimentoNome?: string,
    public procedimentoDescricao?: string | null,
    public setorSaude?: ISetorSaude | null,
    public entidadeNomes?: IEntidadeSaude[] | null
  ) {}
}

export function getTiposProcedimentoIdentifier(tiposProcedimento: ITiposProcedimento): string | undefined {
  return tiposProcedimento.id;
}
