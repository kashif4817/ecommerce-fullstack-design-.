"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";


export default function Providers({ children }) {
  // useState ensures one QueryClient per browser session, not shared across requests
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5  * 60 * 1000,
        gcTime:    30 * 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
