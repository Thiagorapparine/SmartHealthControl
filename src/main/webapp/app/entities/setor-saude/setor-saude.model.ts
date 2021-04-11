export interface ISetorSaude {
  id?: string;
  setorSaude?: string;
}

export class SetorSaude implements ISetorSaude {
  constructor(public id?: string, public setorSaude?: string) {}
}

export function getSetorSaudeIdentifier(setorSaude: ISetorSaude): string | undefined {
  return setorSaude.id;
}
