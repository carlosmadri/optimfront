export enum Role {
  ADMIN = 'admin',
  REGULAR = 'regular',
}

export interface User {
  role: Role.ADMIN | Role.REGULAR;
  userName: string;
  JWT: string;
}
