import axios from "axios";
import { Stack } from "expo-router";

export default function Layout() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://192.168.0.111:3000";
  return (
    <Stack>
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="chatScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
