export interface Session {
  user: {
    name: string;
    email: string;
    image: string;
  };
  id: number;
  expires: string;
  accessToken: string;
}

export interface Token {
  id: number;
  email: string;
  name: string;
  picture: string;
}

export interface User {
  id: number;
  name: string;
  image: string;
  email: string;
}
