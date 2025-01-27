import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IP } from "@/constants/Contants";
import { UserContext } from "@/context/contextApi";
import axios from "axios";
import Markdown from "react-native-markdown-display";

const ChatScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { user } = useContext(UserContext);
  const { name, idOfUser } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function getPrevMessages() {
      setMessages([]);
      await axios
        .get(`http://${IP}:5000/api/social/v1/messages/${user._id}/${idOfUser}`)
        .then((res) => {
          setMessages(res.data);
        });
    }
    getPrevMessages();
  }, [idOfUser]);

  useEffect(() => {
    const myWebSocket = new WebSocket(`ws://${IP}:5000`);
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

    // Cleanup on unmount
    return () => {
      myWebSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const msg = {
        text: message,
        reciever: idOfUser,
        sender: user._id,
        id: `${Math.random()}`,
        status: "Sent",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
      // Update the local message state
      setMessages([...messages, msg]);
      ws.send(JSON.stringify(msg));
      console.log("Message sent:", msg);
      setMessage("");
    } else {
      console.log("WebSocket is not open");
    }
  };

  function handleMessage(e) {
    const newMessage = JSON.parse(e.data);
    console.log("Message received:", newMessage);
    if (newMessage.text) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  }

  return (
    <View style={{ flex: 1, marginTop: top, marginBottom: bottom }}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>{name}</Text>
      </View>

      {/* Message Screen */}
      <ScrollView style={styles.messageContainer}>
        {messages.map((eachMessage, i) => (
          <View
            key={Math.random() * (i + 1)}
            style={
              eachMessage.sender === user._id
                ? styles.outgoingMessage
                : styles.incomingMessage
            }
          >
            <Markdown>{eachMessage.text}</Markdown>
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
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: "#17153B",
    padding: 13,
  },
  topBarText: {
    color: "#EEEDEB",
    fontSize: 18,
  },
  messageContainer: {
    flex: 1, // Takes up the remaining space
    flexDirection: "column",
    padding: 10,
  },
  incomingMessage: {
    alignSelf: "flex-start", // Aligns message to the left
    backgroundColor: "#e1ffc7", // Light green for incoming messages
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%", // To prevent messages from stretching too wide
  },
  outgoingMessage: {
    alignSelf: "flex-end", // Aligns message to the right
    backgroundColor: "#d1d1d1", // Light grey for outgoing messages
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  messageText: {
    body: {
      fontSize: 16,
      color: "#333",
    },
    link: {
      color: "#007AFF",
      textDecorationLine: "underline",
    },
    heading1: {
      fontSize: 24,
      fontWeight: "bold",
    },
    bold: {
      fontWeight: "bold",
    },
    italic: {
      fontStyle: "italic",
    },
  },
  messageInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 3,
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    marginRight: 5,
  },
  messageStatus: {
    fontSize: 12,
    color: "#999",
  },
  seenStatus: {
    color: "#007AFF", // Blue color for seen status
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1, // Takes up the available space
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatScreen;
