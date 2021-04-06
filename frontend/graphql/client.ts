import { createClient } from 'urql';
import { getSession, useSession } from 'next-auth/client';
import { Session } from '../typescript/interfaces/auth';

const client = createClient({
  url: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: () => {
    return {
      headers: {
        // 'x-hasura-admin-secret':
        //   process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET,
        'x-hasura-role': 'user',
        // Authorization: session ? session.token : '',
      },
    };
  },
});

export default client;
