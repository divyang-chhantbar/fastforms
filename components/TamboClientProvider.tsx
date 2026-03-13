"use client";

import { useUser } from "@clerk/nextjs";
import { TamboProvider } from "@tambo-ai/react";

export function TamboClientProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  
  return (
    <TamboProvider 
      apiKey="proxy-managed" // Placeholder, proxy adds the real one
      tamboUrl="/api/tambo" // Points to our local proxy
      userKey={user?.id}
    >
      {children}
    </TamboProvider>
  );
}
