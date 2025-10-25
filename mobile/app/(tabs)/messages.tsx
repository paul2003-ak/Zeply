import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CONVERSATIONS, ConversationType } from "@/data/conversation";
import { Feather } from "@expo/vector-icons";

const Messages = () => {
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [conversationlist, setConversationlist] = useState(CONVERSATIONS);
  const [selectconversation, setSelectconversation] =
    useState<ConversationType | null>(null);
  const [ischatopen, setIschatopen] = useState(false);
  const [newmessage, setNewmessage] = useState("");

  const deleteconversation = (conversationId: number) => {
    Alert.alert(
      "Delete Converstion",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setConversationlist((prev) =>
              prev.filter((conversation) => conversation.id !== conversationId)
            );
          },
        },
      ]
    );
  };

  const openconversation = (conversation: ConversationType) => {
    setSelectconversation(conversation);
    setIschatopen(true);
  };

  const closechat = () => {
    setSelectconversation(null);
    setIschatopen(false);
    setNewmessage("");
  };

  const sendmessage = () => {
    if (newmessage.trim() && selectconversation) {
      setConversationlist((prev) =>
        prev.map((conv) =>
          conv.id === selectconversation.id
            ? {
                ...conv,
                lastMessage: newmessage,
                time: "Now",
                timestamp: new Date(),
              }
            : conv
        )
      );

      setNewmessage("");
      Alert.alert(
        `Message Sent", "Your message has been sent to ${selectconversation.user.name}.`
      );
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 ">
        <Text className="text-xl font-bold text-gray-900">Message</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      {/* search Bar */}
      <View className=" px-4 py-3 border-b border-gray-100 ">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="657786" />
          <TextInput
            placeholder="Search for people and group"
            className=" flex-1 ml-3 text-base "
            placeholderTextColor="#657786"
            value={search}
            onChangeText={setSearch} // in reeact the onchange happen like setsearch(e.target.value)
          />
        </View>
      </View>

      {/* hard coded conversations*/}
      <ScrollView
        className=" flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 + insets.bottom }}
      >
        {conversationlist.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
            onLongPress={() => deleteconversation(conversation.id)}
            onPress={() => openconversation(conversation)}
          >
            <Image
              source={{ uri: conversation.user.avatar }}
              className=" size-12 rounded-full mr-3 "
            />
            <View className="flex-1">
              <View className=" flex-row items-center justify-between mb-1">
                <View className="flex-row items-center">
                  <Text className="font-semibold text-gray-900">
                    {conversation.user.name}
                  </Text>
                  {conversation.user.verified && (
                    <Feather
                      name="check-circle"
                      size={16}
                      color="#1DA1F2"
                      className="ml-1"
                    />
                  )}
                  <Text className=" text-gray-500 text-sm ml-1 ">
                    @{conversation.user.username}
                  </Text>
                </View>
                <Text className=" text-gray-500 text-sm">
                  {conversation.time}
                </Text>
              </View>
              <Text className=" text-gray-500 text-sm">
                {conversation.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick action */}
      <View className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <Text className=" text-center text-gray-500 text-xs">
          Tap to Open * Long Press to delete
        </Text>
      </View>




      {/* after tap this section will open  */}
      <Modal
        visible={ischatopen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectconversation && (
          <SafeAreaView className="flex-1">
            {/* chat header */}
            <View className="flex-row item-center px-4 py-3 border-gray-100 ">
              <TouchableOpacity onPress={closechat} className="mr-3 ">
                <Feather name="arrow-left" size={24} color="#1DA1F2" />
              </TouchableOpacity>
              <Image
                source={{ uri: selectconversation.user.avatar }}
                className="size-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="font-semibold text-gray-900 mr-1">
                    {selectconversation.user.name}
                  </Text>
                  {selectconversation.user.verified && (
                    <Feather
                      name="check-circle"
                      size={16}
                      color="#1DA1F2"
                      className="ml-1"
                    />
                  )}
                </View>
                <Text className="text-gray-500 text-sm">
                  @{selectconversation.user.username}
                </Text>
              </View>
            </View>

            {/* chat message area */}
            <ScrollView className="flex-1 px-4 py-4">
              <View className="mb-4">
                <Text className="text-center text-gray-400 text-sm mb-4 ">
                  This is the biginning o the conversation with{" "}
                  {selectconversation.user.name}
                </Text>

                {/* conversation page */}
                {selectconversation.messages.map((message) => (
                  <View
                    key={message.id}
                    className={`flex-row mb-3 ${message.fromUser ? "justify-end" : ""}`}
                  >
                    {!message.fromUser && (
                      <Image
                        source={{ uri: selectconversation.user.avatar }}
                        className="size-8 rounded-full mr-2"
                      />
                    )}
                    <View
                      className={`flex-1 ${message.fromUser ? "items-end" : ""} `}
                    >
                      <View
                        className={`rounded-2xl px-4 py-3 max-w-xs ${message.fromUser ? "bg-blue-500" : "bg-gray-100"}`}
                      >
                        <Text
                          className={
                            message.fromUser ? "text-white" : "text-gray-900"
                          }
                        >
                          {message.text}
                        </Text>
                      </View>
                      <Text className="  text-xs text-gray-400 mt-1">
                        {message.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>


            {/* Message Input */}
                <View className=" flex-row items-center px-4 py-3 border-t border-gray-100 ">
                  <View className="flex-row flex-1 items-center bg-gray-100 rounded-full px-4 py-3 mr-3 ">
                    <TextInput
                    className="flex-1 text-base"
                    placeholder="Start a Message..."
                    placeholderTextColor="#6557786"
                    value={newmessage}
                    onChangeText={setNewmessage}
                    multiline
                     />
                      </View>
                     <TouchableOpacity onPress={sendmessage} disabled={!newmessage.trim()} className={`size-10 rounded-full items-center justify-center ${newmessage.trim() ? "bg-blue-500" :"bg-gray-300"}`}>
                        <Feather name="send" size={20} color="white"/>
                     </TouchableOpacity>
                </View>

          </SafeAreaView>
        )}
      </Modal>



    </SafeAreaView>
  );
};

export default Messages;
