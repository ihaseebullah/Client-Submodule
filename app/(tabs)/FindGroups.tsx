import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import axios from "axios";
import { IP } from "@/constants/Contants";
import { UserContext } from "@/context/contextApi";

const FindGroups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(UserContext);
  useEffect(() => {
    // Fetch all public groups
    axios
      .get(`http://${IP}:5000/api/social/v1/group/visibility/true/`)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching public groups:", error);
      });
  }, []);

  useEffect(()=>{
    axios.get(`http://${IP}:5000/whoami/${user._id}`).then((res)=>{
      console.log(res.data)
    })
  },[])

  const handleSendJoinRequest = () => {
    axios
      .put(`http://${IP}:5000/api/social/v1/group/join-request`, {
        groupId: selectedGroup._id,
        message: joinMessage,
        userId: user._id,
      })
      .then(() => {
        Alert.alert("Success", "Join request sent.");
        setModalVisible(false);
        setJoinMessage("");
      })
      .catch((error) => {
        console.error("Error sending join request:", error.message);
        Alert.alert("Error", "Failed to send join request.");
      });
  };

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => {
        setSelectedGroup(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.groupName}>{item.groupName}</Text>
      <Text style={styles.groupDescription}>{item.groupDescription}</Text>
      <Text style={styles.groupMembers}>{item.members.length} members</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Find Public Groups ({groups.length})
      </Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={renderGroup}
        contentContainerStyle={styles.groupList}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Join {selectedGroup?.groupName}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Write a message..."
              value={joinMessage}
              onChangeText={setJoinMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSendJoinRequest}
            >
              <Text style={styles.modalButtonText}>Send Join Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D2C4D",
    marginBottom: 20,
  },
  groupList: {
    paddingBottom: 20,
  },
  groupItem: {
    padding: 15,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D2C4D",
  },
  groupDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
  },
  groupMembers: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1D2C4D",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: "#1D2C4D",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 5,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#6B7280",
  },
});

export default FindGroups;
