export class User {
  id: number;
  username: string;
  name: string;
  surname: string;
  password?: string;
  oldPassword?: string;
  enabled: boolean;
  email: string;
  lang: string;
  avatar: string;
  style: string;
  roles: number[];
  isLogged?: boolean;
  isAdmin?: boolean;
  isResp?: boolean;
}
