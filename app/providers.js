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
          <Toaster
            richColors
            closeButton
            expand
            position="top-right"
            theme="light"
            visibleToasts={4}
            toastOptions={{
              classNames: {
                toast: 'border border-slate-200 shadow-lg',
                title: 'text-sm font-semibold',
                description: 'text-sm text-slate-500',
                actionButton: 'bg-blue-500 text-white',
                cancelButton: 'bg-slate-100 text-slate-700',
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
