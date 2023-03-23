import {View, Text, Image} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import moment from 'moment';

type Props = {
  message: Message;
};

const MessageComponent = ({message}: Props) => {
  const user = useSelector(selectUser);

  // CHECK IF THE MESSAGING USER IS THE LOGGED IN ONE IF MESSAGE IS JUST CREATED THEN SET TRUE AS THE MESSAGE IS SENT BY LOGGED IN USER ONLY
  const isUser = message.user._id ? message.user._id === user.uid : true;

  return (
    <View
      className={`bg-[#9e6969] rounded-lg min-w-[110px] max-w-[300px] px-3 py-2 m-3 relative ${
        isUser
          ? 'bg-[#9e6969]/20 border border-[#9e6969] ml-auto'
          : 'bg-[#9e6969] mr-auto'
      }`}>
      <Image
        style={{borderWidth: 1, borderColor: 'white'}}
        className={`h-6 w-6 absolute -bottom-2 rounded-full ${
          isUser && 'right-0'
        }`}
        source={{uri: message.user.photoURL}}
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
          {message._createdAt
            ? moment(message._createdAt!).format('HH:mm A')
            : moment(new Date()).format('HH:mm A')}
        </Text>
      </View>
    </View>
  );
};

export default MessageComponent;
