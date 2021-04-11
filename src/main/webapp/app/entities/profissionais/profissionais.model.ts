import { IEstados } from 'app/entities/estados/estados.model';
import { ISetorSaude } from 'app/entities/setor-saude/setor-saude.model';
import { IEntidadeSaude } from 'app/entities/entidade-saude/entidade-saude.model';

export interface IProfissionais {
  id?: string;
  profissionalNome?: string;
  profissionalHoraInicio?: string;
  profissionalHoraFim?: string;
  estados?: IEstados | null;
  setorSaude?: ISetorSaude | null;
  entidadeNomes?: IEntidadeSaude[] | null;
}

export class Profissionais implements IProfissionais {
  constructor(
    public id?: string,
    public profissionalNome?: string,
    public profissionalHoraInicio?: string,
    public profissionalHoraFim?: string,
    public estados?: IEstados | null,
    public setorSaude?: ISetorSaude | null,
    public entidadeNomes?: IEntidadeSaude[] | null
  ) {}
}

export function getProfissionaisIdentifier(profissionais: IProfissionais): string | undefined {
  return profissionais.id;
}
