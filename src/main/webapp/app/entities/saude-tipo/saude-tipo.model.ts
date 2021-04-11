export interface ISaudeTipo {
  id?: string;
  tipoIdentificacao?: string;
  tipoDescricao?: string;
}

export class SaudeTipo implements ISaudeTipo {
  constructor(public id?: string, public tipoIdentificacao?: string, public tipoDescricao?: string) {}
}

export function getSaudeTipoIdentifier(saudeTipo: ISaudeTipo): string | undefined {
  return saudeTipo.id;
}
