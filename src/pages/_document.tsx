import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#7A93AC" />
        <meta property="og:site_name" content="GMBTS" />
        <meta property="og:fb:app_id" content="255587800325067" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
