"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserSupabaseClient, SessionContextProvider } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionContextProvider>
  );
}
