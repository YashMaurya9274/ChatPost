import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  useColorScheme,
  Image,
  StatusBar,
} from 'react-native';
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {RootStackParamList} from '../navigator/RootNavigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import MessageComponent from '../components/MessageComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ImageLinks from '../assets/images';
import updateSeenStatus from '../lib/updateSeenStatus';
import {client} from '../lib/client';
import sendMessage from '../lib/sendMessage';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import createNewChat from '../lib/createNewChat';
// import useFetchMessageListener from '../hooks/useFetchMessagesListener';
import {v4 as uuidv4} from 'uuid';

type MessageScreenRouteProp = RouteProp<RootStackParamList, 'Messages'>;

export type MessagesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Messages'
>;

const MessageScreen = () => {
  const [message, setMessage] = useState('');
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const scheme = useColorScheme();
  const user = useSelector(selectUser);
  const {
    params: {chatId, messages, friendId, friendImage, friendName, notSeenCount},
  } = useRoute<MessageScreenRouteProp>();

  // const {chatMessages} = useFetchMessageListener(client, user.uid, friendId);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [userChatId, setUserChatId] = useState<string>('');

  const updateSeenStatusOfMessage = async () => {
    if (notSeenCount > 0) {
      const tempMsgs = messages.slice(0, notSeenCount);
      const idsArray = tempMsgs.map(msg => msg._id!);
      await updateSeenStatus(client, idsArray);
    }
  };

  useEffect(() => {
    if (messages) {
      setUserMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      setUserChatId(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    updateSeenStatusOfMessage();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {backgroundColor: scheme === 'dark' ? '#242424' : '#F0F2F5'},
      headerLeft: () => (
        <View className="flex flex-row space-x-5 items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={ImageLinks.arrow.arrowLeft}
              className="h-5 w-5"
              style={{tintColor: scheme === 'dark' ? 'white' : 'black'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={navigateToUserProfile}
            className="flex flex-row space-x-3 items-center">
            <Image
              className="h-8 w-8 rounded-full"
              source={{uri: friendImage}}
            />
            <Text className="text-lg text-gray-800 dark:text-gray-200">
              {friendName}
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [scheme]);

  const navigateToUserProfile = () => {
    navigation.push('UserProfile', {
      userId: friendId,
    });
  };

  const handleSendMessage = async () => {
    if (!message) return;

    const newMessage: Message = {
      _type: 'messages',
      _id: uuidv4(),
      user: {
        _type: 'users',
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      },
      message: message,
      seen: false,
    };

    setUserMessages([newMessage, ...userMessages]);

    if (!userMessages || userMessages?.length === 0) {
      const userOne = {
        _ref: user.uid,
        _type: 'reference',
      };

      const userTwo = {
        _ref: friendId,
        _type: 'reference',
      };

      const resultChatId = await createNewChat(
        client,
        user.uid,
        friendId,
        userOne,
        userTwo,
        message,
      );

      setUserChatId(resultChatId!);
    } else {
      if (userChatId) {
        sendMessage(client, userChatId, message, {
          _ref: user.uid,
          _type: 'reference',
        });
      }
    }

    setMessage('');
  };

  const renderMessage = ({item}: any) => (
    <MessageComponent key={item._id} message={item} />
  );

  return (
    <View className="bg-white flex-1 dark:bg-[#151515]">
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={scheme === 'dark' ? '#242424' : '#F0F2F5'}
      />
      {/* MESSAGES */}
      <FlatList
        data={userMessages}
        inverted
        renderItem={renderMessage}
        // @ts-ignore
        keyExtractor={item => item._id}
      />

      {/* INPUT MESSAGE */}
      <View className="flex flex-row mt-auto p-2 bg-transparent items-center space-x-1">
        <TextInput
          value={message}
          onChangeText={text => setMessage(text)}
          className="flex-1 text-[16px] bg-[#F0F2F5] text-gray-700 max-h-20 rounded-lg p-3 dark:bg-[#3A3B3C] dark:text-gray-300"
          placeholder="Enter message here...."
          placeholderTextColor="gray"
          multiline
          textAlignVertical="center"
        />
        <TouchableOpacity onPress={handleSendMessage} activeOpacity={0.5}>
          <Text className="text-[#9e6969] text-lg">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageScreen;
