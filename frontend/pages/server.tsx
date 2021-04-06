import React from 'react';
import { getSession } from 'next-auth';
import { GetServerSideProps } from 'next';

interface ServerProps {
  session: any;
}

const Server: React.FC<ServerProps> = ({ session }) => {
  console.log(session);

  return <div>SERVER</div>;
};

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

export default Server;
