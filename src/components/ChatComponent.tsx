import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';

export type MessageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Messages'
>;

type Props = {
  chat: Chat;
};

const ChatComponent = ({chat}: Props) => {
  const navigation = useNavigation<MessageScreenNavigationProp>();
  const [messages, setMessages] = useState<Message[]>([]);
  const isFocused = useIsFocused();
  const user = useSelector(selectUser);
  const [notSeenCount, setNotSeenCount] = useState<number>(0);
  const [otherUser, setOtherUser] = useState<User>();

  useEffect(() => {
    countNotSeenMessages();
    getOtherUser();
  }, [messages]);

  const countNotSeenMessages = () => {
    setNotSeenCount(0);
    // FINDING HOW MANY MESSAGES ARE UNSEEN
    const unseenMessageSender = messages.filter(message => !message?.seen);

    // CHECKING IF THE ID OF THE SENDER IS SIMILAR TO THE LOGGED IN USER
    if (unseenMessageSender[0]?.user?._id !== user.uid) {
      setNotSeenCount(unseenMessageSender.length);
    }
  };

  const manageMessages = () => {
    if (chat.messages) {
      let msgs = [...chat?.messages];
      setMessages([...msgs.reverse()]);
    }
  };

  const getOtherUser = () => {
    if (chat.userOne._id === user.uid) setOtherUser(chat.userTwo);
    else if (chat.userTwo._id === user.uid) setOtherUser(chat.userOne);
  };

  useEffect(() => {
    if (isFocused) {
      manageMessages();
    }
  }, [isFocused, chat]);

  const navigateToMessagesScreen = () => {
    navigation.navigate('Messages', {
      chatId: chat._id!,
      messages: messages,
      friendId: otherUser?._id!,
      friendImage: otherUser?.photoURL!,
      friendName: otherUser?.displayName!,
      notSeenCount: notSeenCount,
    });
  };

  return (
    <TouchableOpacity
      onPress={navigateToMessagesScreen}
      activeOpacity={0.7}
      className="flex flex-row justify-between items-center bg-[#E9E9E9] p-3 rounded-lg mx-2 mt-3 dark:bg-[#242424]">
      <View className="flex flex-row items-center space-x-3">
        <Image
          className="h-11 w-11 rounded-full"
          source={{uri: otherUser?.photoURL}}
        />
        <View>
          <Text className="text-gray-900 text-base font-bold dark:text-gray-300">
            {otherUser?.displayName}
          </Text>
          <Text
            numberOfLines={1}
            className={`text-gray-600 w-64 dark:text-gray-400 ${
              notSeenCount > 0 && 'font-bold'
            }`}>
            {messages[0]?.message}
          </Text>
        </View>
      </View>

      {notSeenCount > 0 && (
        <View className="bg-[#5b5b5b] rounded-full py-1 px-2 dark:bg-[#E9E9E9]">
          <Text className="text-[#E9E9E9] font-semibold text-center text-xs dark:text-[#242424]">
            {notSeenCount < 99 ? notSeenCount : '99 +'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ChatComponent;
