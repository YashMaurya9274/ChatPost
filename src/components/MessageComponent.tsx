import {View, Text, Image} from 'react-native';
import React from 'react';
import {Message} from '../../typings';

type Props = {
  message: Message;
};

const MessageComponent = ({message}: Props) => {
  const isUser = false;

  return (
    <View
      className={`flex bg-[#9e6969] rounded-lg w-52 px-3 py-2 m-3 relative ${
        isUser
          ? 'bg-[#9e6969]/20 border border-[#9e6969] ml-auto'
          : 'bg-[#9e6969]'
      }`}>
      <Image
        style={{borderWidth: 1, borderColor: 'white'}}
        className={`h-6 w-6 absolute -bottom-2 rounded-full ${
          isUser && 'right-0'
        }`}
        source={{uri: message.userImage}}
      />

      <View>
        <Text
          className={`${
            isUser ? 'text-gray-900' : 'text-white'
          } text-[16px] dark:text-gray-100`}>
          {message.message}
        </Text>
        <Text
          className={`text-xs mt-2 ${
            isUser ? 'text-gray-600 mr-auto' : 'text-gray-50 ml-auto'
          } dark:text-gray-200`}>
          {new Date(message.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export default MessageComponent;
