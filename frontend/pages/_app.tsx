import type { AppProps } from 'next/app';
import { Provider as AuthProvider } from 'next-auth/client';
import { Provider as GraphqlProvider } from 'urql';
import client from '../graphql/client';

function App({ Component, pageProps }: AppProps) {
  const { session } = pageProps;

  return (
    <GraphqlProvider value={client}>
      <AuthProvider session={session}>
        <Component {...pageProps} />
      </AuthProvider>
    </GraphqlProvider>
  );
}

export default App;
