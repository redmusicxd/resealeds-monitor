import { ColorModeScript } from "@chakra-ui/react";
import { Html, Head, Main, NextScript } from "next/document";
import theme from "./theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head >
      <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
