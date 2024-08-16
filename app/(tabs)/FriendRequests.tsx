import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { UserContext } from "@/context/contextApi";
import { IP } from "@/constants/Contants";

const FriendRequests = () => {
  const { user } = useContext(UserContext);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    // Fetch friend requests from the server
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(
          `http://${IP}:5000/api/social/v1/get-friend-request/${user._id}/`
        );
        setFriendRequests(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchFriendRequests();
  }, []);

  const handleAccept = async (id) => {
    await axios.put(
      `http://${IP}:5000/api/social/v1/updateFriendRequest/${
        user._id
      }/${id}/${1}`
    );
    // Implement logic to accept friend requests
    console.log(`Accepted friend request from ${id}`);
  };

  const handleDecline = async (id) => {
    // Implement logic to decline friend requests
    await axios.put(
      `http://${IP}:5000/api/social/v1/updateFriendRequest/${
        user._id
      }/${id}/${0}`
    );
    console.log(`Declined friend request from ${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friend Requests</Text>
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.username}>{item.username}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleAccept(item._id)}
              >
                <Ionicons name="person-add-outline" size={20} color="#007AFF" />
                <Text style={styles.connectText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleDecline(item._id)}
              >
                <Ionicons
                  name="person-remove-outline"
                  size={20}
                  color="#007AFF"
                />
                <Text style={styles.connectText}>Decline</Text>
              </TouchableOpacity>
            </View>
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
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    marginTop: 23,
  },
  requestItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  declineButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
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

export default FriendRequests;
