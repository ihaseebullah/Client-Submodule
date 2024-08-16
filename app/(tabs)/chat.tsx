import React, { useContext, useEffect, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Tile from "@/components/TIle"; // Fixing import casing
import { UserContext } from "@/context/contextApi";
import axios from "axios";
import { IP } from "@/constants/Contants";

const Chat = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { user } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    async function getFriends() {
      await axios
        .get(`http://${IP}:5000/api/social/v1/friends/${user._id}/`)
        .then((res) => {
          setFriends(res.data);
        });
    }
    getFriends();
  }, []);
  return (
    <View style={{ flex: 1, marginTop: top, marginBottom: bottom }}>
      {/* Top Bar */}
      <View style={{ backgroundColor: "#17153B", padding: 13 }}>
        <Text style={{ color: "#EEEDEB", fontSize: 18 }}>Home</Text>
      </View>

      {/* Main Screen */}
      <View style={{ flex: 1, minHeight: height }}>
        {/* USERS */}
        {friends.map((friend, i) => {
          return (
            <Tile
              name={friend.username}
              unread={10}
              lastSeen={"Last seen 10 minutes ago"}
              image={"./"}
              key={`${friend._id},${Math.random()}`}
              idOfUser={friend._id}
            />
          );
        })}
      </View>
    </View>
  );
};

export default Chat;
