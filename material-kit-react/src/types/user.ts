export interface User {
  id: number;
  username: string;
  avatar?: string;
  email: string;
  realname: string;
  is_staff: boolean;
  groups: string[];
  [key: string]: unknown;
}
