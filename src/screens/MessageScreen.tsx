import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {RootStackParamList} from '../components/Navigator';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Message} from '../../typings';
import MessageComponent from '../components/MessageComponent';

type MessageScreenRouteProp = RouteProp<RootStackParamList, 'Messages'>;

const MessageScreen = () => {
  const [message, setMessage] = useState('');
  const {
    params: {messages},
  } = useRoute<MessageScreenRouteProp>();

  const sendMessage = () => {
    if (!message) return;

    // TODO: Build send message functionality
  };

  const renderMessage = ({item}: any) => (
    <MessageComponent key={item.id} message={item} />
  );

  return (
    <View className="bg-white flex-1 dark:bg-[#151515]">
      {/* MESSAGES */}
      <FlatList
        data={messages}
        inverted
        renderItem={renderMessage}
        keyExtractor={item => item.id}
      />

      {/* <ScrollView contentContainerStyle={{paddingBottom: 20}} bounces>
        {messages.map((message: Message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
      </ScrollView> */}

      {/* INPUT MESSAGE */}
      <View className="flex flex-row mt-auto p-2 bg-transparent items-center space-x-1">
        <TextInput
          value={message}
          onChangeText={text => setMessage(text)}
          className="flex-1 text-[16px] bg-gray-300 text-gray-700 max-h-20 rounded-lg p-3 dark:bg-gray-800 dark:text-gray-300"
          placeholder="Enter message here...."
          placeholderTextColor="gray"
          multiline
          textAlignVertical="center"
        />
        <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
          <Text className="text-[#9e6969] text-lg">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageScreen;
