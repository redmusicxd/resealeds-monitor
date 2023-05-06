import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import theme from "@/lib/theme";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { IMonitoredProducts } from "@/lib/database";

export default function App({ Component, pageProps }: AppProps<{
  initialSession: Session
}>) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<IMonitoredProducts>({supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
   supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}));
  return (
    <ChakraProvider theme={theme}>
      <SessionContextProvider supabaseClient={supabaseClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionContextProvider>
    </ChakraProvider>
  );
}
