import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
