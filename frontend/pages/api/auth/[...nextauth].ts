import NextAuth, { NextAuthOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import { Session, User, Token } from '../../../typescript/interfaces/auth';

const jwtSecret = JSON.parse(process.env.AUTH_PRIVATE_KEY);

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Email({
      server: {
        // tls: {
        //   rejectUnauthorized: false,
        // },
        port: 465,
        host: 'smtp.gmail.com',
        // secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        // tls: {
        //   rejectUnauthorized: false,
        // },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: process.env.NODE_ENV === 'production',
    extra: process.env.NODE_ENV === 'production' && {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  session: {
    jwt: true,
  },
  jwt: {
    encode: async ({ token }: { token: Token }) => {
      const tokenContents = {
        id: token.id,
        name: token.name,
        email: token.email,
        picture: token.picture,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['admin', 'user'],
          'x-hasura-default-role': 'user',
          'x-hasura-role': 'user',
          'x-hasura-user-id': token.id,
        },
        iat: Date.now() / 1000,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        sub: token.id,
      };

      const encodedToken = jwt.sign(tokenContents, jwtSecret.key, {
        algorithm: jwtSecret.type,
      });

      console.log('#################');
      console.log('jwt encode');
      console.log('#################');

      return encodedToken;
    },
    decode: async ({ token }: { token: string }) => {
      const decodedToken = jwt.verify(token, jwtSecret.key, {
        algorithms: jwtSecret.type,
      });

      console.log('#################');
      console.log('jwt decode');
      console.log('#################');
      return decodedToken;
    },
  },
  debug: true,
  callbacks: {
    signIn: async (user, account, profile) => {
      console.log('#################');
      console.log('signin callback', user, account, profile);
      console.log('#################');
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    session: async (session: Session, user: User) => {
      const encodedToken = jwt.sign(user, jwtSecret.key, {
        algorithm: jwtSecret.type,
      });
      console.log(session);

      session.id = user.id;
      session.accessToken = encodedToken;

      console.log('#################');
      console.log('session', user);
      console.log('#################');
      return Promise.resolve(session);
    },
    jwt: async (token: Token, user: User) => {
      const isSignIn = user ? true : false;
      console.log('#################');
      console.log('jwt callback');
      console.log('#################');

      if (isSignIn) {
        token.id = user.id;
      }

      return Promise.resolve(token);
    },
  },
};

const Auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default Auth;
