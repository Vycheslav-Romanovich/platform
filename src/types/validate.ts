export interface Fields {
  email?: string;
  name?: string;
  text?: string;
  password?: string;
  passwordRepeat?: string;
  politics?: boolean;
}

export interface Errors {
  email?: string;
  name?: string;
  text?: string;
  password?: string;
  passwordRepeat?: string;
  politics?: string;
}

export interface Touched {
  email?: boolean;
  name?: string;
  text?: string;
  password?: boolean;
  passwordRepeat?: boolean;
  politics?: boolean;
}
