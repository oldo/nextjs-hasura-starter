import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useQuery } from 'urql';
import { useFetchUsersQuery, Users } from '../typescript/generated';

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const [session, loading] = useSession();
  const [{ fetching, data }] = useFetchUsersQuery();

  return (
    <div>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}

      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}

      {fetching && <div>FETCHING</div>}
      {data &&
        data?.users.map((u) => (
          <div key={u.id}>
            {u.id} - {u.email}
          </div>
        ))}
    </div>
  );
};

export default Home;
