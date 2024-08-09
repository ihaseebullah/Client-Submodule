import { UserProvider } from "@/context/contextApi";
import axios from "axios";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
