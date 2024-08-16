import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { UserContext } from "@/context/contextApi";
import { IP } from "@/constants/Contants";

const Friends = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [find, setFind] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const { user } = useContext(UserContext);
  useEffect(() => {
    async function getUsers() {
      await axios
        .get(`http://${IP}:5000/api/social/v1/find/${user.username}`)
        .then((res) => {
          setUsers(res.data);
          setFilteredUsers(res.data);
        });
    }
    getUsers();
  }, []);

  // Function to filter users based on the search query
  const handleSearch = (text) => {
    setFind(text);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Function to handle connect button press
  const handleConnect = async (userId) => {
    await axios
      .post(`http://${IP}:5000/api/social/v1/friends/${user._id}/`)
      .then((res) => {
        if (res.status === 201) {
          ToastAndroid.show(
            `Friend request sent to user ${userId}`,
            ToastAndroid.SHORT
          );
        } else {
          ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
        }
      })
      .catch((err) => {
        console.log(err);
        ToastAndroid.show(
          "Cannot send friend request twice",
          ToastAndroid.SHORT
        );
      });

    console.log(`Connecting with user ${userId}`);
  };

  return (
    <View style={[styles.container, { marginTop: top, marginBottom: bottom }]}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#777" style={styles.icon} />
        <TextInput
          value={find}
          onChangeText={handleSearch}
          style={styles.input}
          placeholder="Search for friends..."
          placeholderTextColor="#777"
        />
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.username}>{item.username}</Text>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => handleConnect(item._id)}
            >
              <Ionicons name="person-add-outline" size={20} color="#007AFF" />
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10, // Space between search bar and user list
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  username: {
    fontSize: 16,
    color: "#333",
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#e6f2ff",
    borderRadius: 5,
  },
  connectText: {
    marginLeft: 5,
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default Friends;
