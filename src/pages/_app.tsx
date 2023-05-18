import '@/styles/globals.css';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import Layout from '@/client/components/layout';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#171A21',
          },
          secondary: {
            main: '#afb3f7',
          },
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <>
      <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-MRGPQ3LEYF" />
      <Script strategy="lazyOnload">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-MRGPQ3LEYF', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>

      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
