import { useNavigation, useRouter } from "expo-router";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Image,
  Switch,
  ScrollView,
} from "react-native";
import axios from "axios";
import { IP } from "@/constants/Contants";
import { UserContext } from "@/context/contextApi";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupLocation, setNewGroupLocation] = useState("");
  const [newGroupAdmins, setNewGroupAdmins] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const Router = useRouter();
  const { user } = useContext(UserContext);
  const nav = useNavigation();
  useEffect(() => {
    axios
      .get(`http://${IP}:5000/api/social/v1/group/member/${user._id}/`)
      .then((res) => {
        setGroups([...res.data]);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://${IP}:5000/api/social/v1/friends/${user._id}/`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleSelectMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleCreateGroup = () => {
    const groupData = {
      groupName: newGroupName,
      groupDescription: newGroupDescription,
      members: [...selectedMembers, user._id],
      admins: [user._id],
      location: newGroupLocation,
      public: isPublic,
    };

    axios
      .post(`http://${IP}:5000/api/social/v1/group/create`, groupData)
      .then((response) => {
        setGroups([...groups, response.data]);
        setModalVisible(false);
        setNewGroupName("");
        setNewGroupDescription("");
        setNewGroupLocation("");
        setSelectedMembers([]);
        setIsPublic(false);
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };
  const formatDateTime = (dateString) => {
    const options = {
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const renderGroup = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          Router.replace(`(group)/${item._id}`);
        }}
        style={styles.groupItem}
      >
        <Image
          source={{ uri: "https://via.placeholder.com/50" }} // Placeholder for group avatar
          style={styles.avatar}
        />
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{item.groupName}</Text>
          <Text style={styles.lastMessage}>
            {item.messeges.length === 0
              ? "Created new group!"
              : item.messeges[0].message}
          </Text>
        </View>
        <Text style={styles.lastActive}>{formatDateTime(item.updatedAt)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Groups</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createButtonText}>Create a New Group</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createButton} onPress={()=>nav.navigate("FindGroups")}>
        <Text style={styles.createButtonText}>Join a group</Text>
      </TouchableOpacity>

      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.groupList}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Group</Text>
            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Group Name"
                value={newGroupName}
                onChangeText={setNewGroupName}
              />
              <TextInput
                style={styles.input}
                placeholder="Group Description"
                value={newGroupDescription}
                onChangeText={setNewGroupDescription}
              />
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={newGroupLocation}
                onChangeText={setNewGroupLocation}
              />

              <Text style={styles.inputLabel}>Select Members</Text>
              {users.map((user) => (
                <TouchableOpacity
                  key={user._id}
                  style={styles.checkboxContainer}
                  onPress={() => handleSelectMember(user._id)}
                >
                  <View style={styles.checkbox}>
                    {selectedMembers.includes(user._id) && (
                      <View style={styles.checkboxInner} />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{user.username}</Text>
                </TouchableOpacity>
              ))}

              {/* Display selected members */}
              {selectedMembers.length > 0 && (
                <View style={styles.selectedMembersContainer}>
                  {selectedMembers.map((member, index) => (
                    <Text key={index} style={styles.selectedMember}>
                      {users.find((user) => user._id === member)?.username}
                    </Text>
                  ))}
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Admins (comma separated IDs)"
                value={newGroupAdmins}
                onChangeText={setNewGroupAdmins}
              />
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Public Group</Text>
                <Switch value={isPublic} onValueChange={setIsPublic} />
              </View>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCreateGroup}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D2C4D",
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#1D2C4D",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  groupList: {
    paddingBottom: 20,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D2C4D",
  },
  lastMessage: {
    fontSize: 14,
    color: "#6B7280",
  },
  lastActive: {
    fontSize: 12,
    color: "#9CA3AF",
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
    fontSize: 24,
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
  inputLabel: {
    fontSize: 16,
    color: "#1D2C4D",
    marginBottom: 8,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: "#1D2C4D",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1D2C4D",
  },
  selectedMembersContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  selectedMember: {
    fontSize: 14,
    color: "#1D2C4D",
    backgroundColor: "#E5E7EB",
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: "#1D2C4D",
    marginRight: 10,
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

export default Groups;
