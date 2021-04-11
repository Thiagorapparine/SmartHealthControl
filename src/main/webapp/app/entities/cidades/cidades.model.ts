import { IEstados } from 'app/entities/estados/estados.model';

export interface ICidades {
  id?: string;
  cidadeNome?: string;
  estados?: IEstados | null;
}

export class Cidades implements ICidades {
  constructor(public id?: string, public cidadeNome?: string, public estados?: IEstados | null) {}
}

export function getCidadesIdentifier(cidades: ICidades): string | undefined {
  return cidades.id;
}
