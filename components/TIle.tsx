import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";

interface TileProps {
  image: string; // Use lowercase 'string'
  name: string;
  lastSeen: string;
  unread: number; // Use lowercase 'number'
  idOfUser: String;
}

const Tile = ({
  name,
  lastSeen,
  unread,
  image,
  idOfUser,
}: TileProps) => {
  const navigation = useNavigation(); // Use a lowercase variable for the hook instance
  const handlePress = () => {
    console.log(idOfUser)
    navigation.navigate("chatScreen", {
      name: name,
      idOfUser: idOfUser,
    }); // Correct usage of navigation
  };

  return (
    <TouchableOpacity
      onPress={handlePress} // Pass the function directly
      style={{
        borderColor: "black",
        margin: 3,
        borderRadius: 3,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
      }}
    >
      <View>
        <Image
          source={require("@/assets/images/icon.png")} // Use require to load the image
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            borderColor: "black",
            borderWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
      <View style={{ flex: 1, margin: 10 }}>
        <Text style={{ color: "#131842", fontWeight: "bold" }}>{name}</Text>
        <Text style={{ color: "#131842", fontSize: 14 }}>{lastSeen}</Text>
      </View>
      <View style={{ marginLeft: "auto" }}>
        <View
          style={{
            backgroundColor: "#17153B",
            borderRadius: 100,
            height: 20,
            width: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#F3F7EC",
              fontWeight: "bold",
              fontSize: 10,
            }}
          >
            {unread}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Tile;
