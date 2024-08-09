import React, { useState, useCallback } from 'react';
import { View, FlatList, TextInput, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: string;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'Support',
    },
    {
        id: '2',
        text: 'Hello! How can I help you today?',
        sender: 'Support',
      },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = useCallback(() => {
    if (inputText.trim().length > 0) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        text: inputText,
        sender: 'User',
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
    }
  }, [inputText, messages]);

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'User' ? styles.userBubble : styles.supportBubble,
      ]}
    >
      <Text style={item.sender === 'User' ? styles.userText : styles.supportText}>
        FUck
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  supportBubble: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#fff',
  },
  supportText: {
    color: '#000',
  },
});

export default ChatScreen;
