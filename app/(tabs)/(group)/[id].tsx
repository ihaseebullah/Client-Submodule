import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IP } from "@/constants/Contants";
import { UserContext } from "@/context/contextApi";
import axios from "axios";
import Markdown from "react-native-markdown-display";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { user } = useContext(UserContext);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState({});

  useEffect(() => {
    async function getPrevMessages() {
      setMessages([]);
      await axios
        .get(`http://${IP}:5000/api/social/v1/group/chats/${id}/${user._id}`)
        .then((res) => {
          setMessages(res.data.messeges); // Adjusted to access the 'messeges' array correctly
        });
    }
    getPrevMessages();
  }, [id]);

  useEffect(() => {
    axios.get(`http://${IP}:5000/api/social/v1/group/id/${id}`).then((res) => {
      setGroup(res.data);
    });
  }, []);

  useEffect(() => {
    const myWebSocket = new WebSocket(`ws://${IP}:5000/`);
    myWebSocket.onopen = () => {
      console.log("WebSocket connection established");
    };
    myWebSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    myWebSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    myWebSocket.addEventListener("message", handleMessage);
    setWs(myWebSocket);
    return () => {
      myWebSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const msg = {
        text: message,
        reciever: "Group",
        sender: user._id,
        senderUsername: user.username,
        id: `${Math.random()}`,
        status: "Sent",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        groupId: id,
      };
      setMessages([
        ...messages,
        {
          ...msg,
          sender: { _id: user._id, username: user.username },
        },
      ]);
      ws.send(JSON.stringify(msg));
      setMessage("");
    } else {
      console.log("WebSocket is not open");
    }
  };

  function handleMessage(e) {
    const newMessage = JSON.parse(e.data);
    if (newMessage.text) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          sender: {
            _id: newMessage.sender,
            username: newMessage.senderUsername,
          },
        },
      ]);
    }
  }

  const nav = useNavigation();
  return (
    <View style={{ flex: 1, marginTop: top, marginBottom: bottom }}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>{group.groupName}</Text>
        <TouchableOpacity
          onPress={() =>
            nav.navigate("details", {
              groupId: id,
            })
          }
        >
          <Ionicons name="settings" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Message Screen */}
      <ScrollView
        style={styles.messageContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((eachMessage, i) => (
          <View
            key={eachMessage._id || i} // Added fallback key as eachMessage._id
            style={
              eachMessage.sender._id === user._id
                ? styles.outgoingMessage
                : styles.incomingMessage
            }
          >
            <Text style={styles.usernameText}>
              {eachMessage.sender.username}
            </Text>
            <Markdown style={styles.markdown}>{eachMessage.text}</Markdown>
            <View style={styles.messageInfo}>
              <Text style={styles.messageTime}>
                {eachMessage.time
                  ? eachMessage.time
                  : new Date(eachMessage.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
              </Text>
              <Text
                style={[
                  styles.messageStatus,
                  eachMessage.status === "Seen" && styles.seenStatus,
                ]}
              >
                {eachMessage.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input Tag */}
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          placeholder="Write a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  messageContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  usernameText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 5,
  },
  incomingMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#D1FAE5",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  outgoingMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#93C5FD",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  markdown: {
    body: {
      fontSize: 16,
      color: "#333",
    },
  },
  messageInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 5,
  },
  messageTime: {
    fontSize: 12,
    color: "#6B7280",
    marginRight: 5,
  },
  messageStatus: {
    fontSize: 12,
    color: "#6B7280",
  },
  seenStatus: {
    color: "#34D399",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#E5E7EB",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#1E3A8A",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
