import axios from "axios";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { IP } from "@/constants/Contants";

export default function Layout() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = `${IP}:5000`;
  
  return (
    <Tabs>
      <Tabs.Screen
        name="chat"
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          tabBarLabel: "Groups",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Friends"
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="FriendRequests"
        options={{
          tabBarLabel: "Friend Requests",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chatScreen"
        options={{
          tabBarButton: () => null,
          tabBarLabel: "Chat Screen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen name="(group)"  options={{
          tabBarButton: () => null,
          tabBarLabel: "Chat Screen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}/>
        <Tabs.Screen name="FindGroups"  options={{
          tabBarButton: () => null,
          tabBarLabel: "Chat Screen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}/>
    </Tabs>
  );
}
