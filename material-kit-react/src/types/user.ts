export interface User {
  id: number;
  username: string;
  avatar?: string;
  email: string;
  realname: string;

  [key: string]: unknown;
}
