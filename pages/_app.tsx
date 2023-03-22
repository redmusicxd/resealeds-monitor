import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import theme from "@/lib/theme";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/initSupabase";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SessionContextProvider supabaseClient={supabase}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionContextProvider>
    </ChakraProvider>
  );
}
