import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import "../global.css";
const queryclint =new QueryClient();

export default function RootLayout() {
  return (
    <ClerkProvider  tokenCache={tokenCache}>
      <QueryClientProvider client={queryclint}>
      <Stack screenOptions={{ headerShown: false}}  >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
