import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { IP } from "@/constants/Contants";

const GroupDetails = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const Router = useRouter();
  const { groupId } = useLocalSearchParams();

  useEffect(() => {
    // Fetch group details by groupId
    axios
      .get(`http://${IP}:5000/api/social/v1/group/id/${groupId}`)
      .then((response) => {
        setGroup(response.data);
        setNewGroupName(response.data.groupName);
        setNewGroupDescription(response.data.groupDescription);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching group details:", error);
        setLoading(false);
      });
  }, [groupId]);

  const handleSaveChanges = () => {
    axios
      .put(`http://${IP}:5000/api/social/v1/group/update/${groupId}`, {
        groupName: newGroupName,
        groupDescription: newGroupDescription,
      })
      .then(() => {
        Alert.alert("Success", "Group details updated.");
        setGroup((prevGroup) => ({
          ...prevGroup,
          groupName: newGroupName,
          groupDescription: newGroupDescription,
        }));
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error updating group details:", error);
      });
  };

  const handleRemoveMember = (userId) => {
    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => {
            axios
              .put(`http://${IP}:5000/api/social/v1/group/remove-member`, {
                groupId: group._id,
                userId,
              })
              .then(() => {
                setGroup((prevGroup) => ({
                  ...prevGroup,
                  members: prevGroup.members.filter(
                    (member) => member._id !== userId
                  ),
                }));
              })
              .catch((error) => {
                console.error("Error removing member:", error);
              });
          },
        },
      ]
    );
  };

  const handleRevokeAdmin = (userId) => {
    Alert.alert(
      "Revoke Admin Privileges",
      "Are you sure you want to revoke this member's admin privileges?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revoke",
          onPress: () => {
            axios
              .put(`http://${IP}:5000/api/social/v1/group/revoke-admin`, {
                groupId: group._id,
                userId,
              })
              .then(() => {
                setGroup((prevGroup) => ({
                  ...prevGroup,
                  admins: prevGroup.admins.filter((admin) => admin !== userId),
                }));
              })
              .catch((error) => {
                console.error("Error revoking admin privileges:", error);
              });
          },
        },
      ]
    );
  };

  const handleJoinRequest = (userId, action) => {
    axios
      .put(`http://${IP}:5000/api/social/v1/group/join-request/process/`, {
        groupId: group._id,
        userId,
        status: action,
      })
      .then(() => {
        setGroup((prevGroup) => ({
          ...prevGroup,
          joinRequests: prevGroup.joinRequests.filter(
            (request) => request._id !== userId
          ),
        }));
      })
      .catch((error) => {
        console.error(`Error processing join request: ${error}`);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1D2C4D" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {editing ? (
          <>
            <TextInput
              style={styles.input}
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <TextInput
              style={styles.input}
              value={newGroupDescription}
              onChangeText={setNewGroupDescription}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.headerText}>{group.groupName}</Text>
            <Text style={styles.descriptionText}>{group.groupDescription}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.sectionHeader}>Members</Text>
      <FlatList
        data={group.members}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberItem}
            onPress={() =>
              Alert.alert(
                "Member Options",
                `What would you like to do with ${item.username}?`,
                [
                  {
                    text: "Remove Member",
                    onPress: () => handleRemoveMember(item._id),
                  },
                  {
                    text: "Revoke Admin",
                    onPress: () => handleRevokeAdmin(item._id),
                    style: "destructive",
                  },
                  { text: "Cancel", style: "cancel" },
                ]
              )
            }
          >
            <Text style={styles.memberName}>{item.username}</Text>
            {group.admins.includes(item._id) && (
              <Text style={styles.adminBadge}>Admin</Text>
            )}
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionHeader}>Join Requests</Text>
      <FlatList
        data={group.joinRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.joinRequestItem}>
            <Text style={styles.memberName}>{item.userId.username}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
            <View style={styles.joinRequestActions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleJoinRequest(item._id, "accept")}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleJoinRequest(item._id, "decline")}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.sectionHeader}>Messages</Text>
      <FlatList
        data={group.messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={styles.messageSender}>{item.sender.username}:</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => Router.back()}>
        <Text style={styles.backButtonText}>Back to Groups</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D2C4D",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1D2C4D",
    marginVertical: 10,
  },
  memberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberName: {
    fontSize: 16,
    color: "#1D2C4D",
  },
  adminBadge: {
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "#FF5733",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  messageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  messageSender: {
    fontWeight: "bold",
    color: "#1D2C4D",
  },
  messageText: {
    color: "#6B7280",
  },
  joinRequestItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  joinRequestActions: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#28A745",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  declineButton: {
    backgroundColor: "#DC3545",
    padding: 8,
    borderRadius: 5,
  },
  backButton: {
    backgroundColor: "#1D2C4D",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: "#1D2C4D",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default GroupDetails;
