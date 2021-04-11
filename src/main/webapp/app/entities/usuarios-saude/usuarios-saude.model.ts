import { IUser } from 'app/entities/user/user.model';
import { ICidades } from 'app/entities/cidades/cidades.model';

export interface IUsuariosSaude {
  id?: string;
  usuarioFotoContentType?: string | null;
  usuarioFoto?: string | null;
  usuarioNome?: string;
  usuarioCPF?: string;
  usuarioDataNascimento?: string;
  user?: IUser | null;
  cidades?: ICidades | null;
}

export class UsuariosSaude implements IUsuariosSaude {
  constructor(
    public id?: string,
    public usuarioFotoContentType?: string | null,
    public usuarioFoto?: string | null,
    public usuarioNome?: string,
    public usuarioCPF?: string,
    public usuarioDataNascimento?: string,
    public user?: IUser | null,
    public cidades?: ICidades | null
  ) {}
}

export function getUsuariosSaudeIdentifier(usuariosSaude: IUsuariosSaude): string | undefined {
  return usuariosSaude.id;
}
