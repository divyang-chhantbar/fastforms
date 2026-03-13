"use client";

import { useUser } from "@clerk/nextjs";
import { TamboProvider } from "@tambo-ai/react";

export function TamboClientProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  
  return (
    <TamboProvider 
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      userKey={user?.id}
    >
      {children}
    </TamboProvider>
  );
}
