export interface IEstados {
  id?: string;
  estadosNome?: string;
  estadosSigla?: string;
}

export class Estados implements IEstados {
  constructor(public id?: string, public estadosNome?: string, public estadosSigla?: string) {}
}

export function getEstadosIdentifier(estados: IEstados): string | undefined {
  return estados.id;
}
