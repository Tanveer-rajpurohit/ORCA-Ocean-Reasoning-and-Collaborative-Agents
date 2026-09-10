export interface User {
  id: string;
  full_name: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
}
