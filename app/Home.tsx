import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { UserContext } from "@/context/contextApi";
const Home = () => {
  const [username, setUserName] = useState("");
  const Router = useRouter();
  const { setUser } = useContext(UserContext);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity>
        <TextInput
          onChangeText={setUserName}
          placeholder="Enter your username to go in."
        />
        <TouchableOpacity
          onPress={() =>
            axios
              .post("/login", { username })
              .then((res) => {
                if (res.status === 200) {
                  setUser(res.data.user);
                  Router.replace("/(tabs)/chat");
                } else {
                  console.warn("Failed to login");
                }
              })
          }
        >
          <Text>Go to chat</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
