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
      className={`bg-[#9e6969] rounded-lg min-w-[100px] max-w-[300px] px-3 py-2 mx-3 my-4 relative ${
        isUser
          ? 'bg-[#9e6969]/20 border border-[#9e6969] ml-auto'
          : 'bg-[#694242]/90 mr-auto'
      }`}>
      {/* <Image
        style={{borderWidth: 1, borderColor: 'white'}}
        className={`h-5 w-5 absolute -bottom-2 rounded-full ${
          isUser && 'right-0'
        }`}
        source={{uri: message.user.photoURL}}
      /> */}

      <View className="flex flex-row justify-between space-x-4">
        <Text
          className={`${
            isUser ? 'text-gray-900' : 'text-white'
          } text-[16px] dark:text-gray-100`}>
          {message.message}
        </Text>

        <Text
          className={`text-xs font-light mt-auto -mb-1 -mr-1 ${
            isUser ? 'text-gray-700' : 'text-gray-100'
          } dark:text-gray-300`}>
          {message._createdAt
            ? moment(message._createdAt!).format('HH:mm')
            : moment(new Date()).format('HH:mm')}
        </Text>
      </View>

      <Text
        className={`absolute -bottom-5 text-xs text-gray-600 right-0 dark:text-gray-300`}>
        {message._createdAt
          ? moment(message._createdAt!).format('ddd D MMM, YY')
          : moment(new Date()).format('ddd D MMM, YY')}
      </Text>
    </View>
  );
};

export default MessageComponent;
