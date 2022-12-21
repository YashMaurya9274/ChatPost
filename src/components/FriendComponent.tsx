import {View, Text, Image} from 'react-native';
import React from 'react';
import {Friend} from '../../typings';

type Props = {
  friend: Friend;
};

const FriendComponent = ({friend}: Props) => {
  return (
    <View className="justify-center">
      <View className="flex flex-row p-4 items-center space-x-3">
        <Image
          className="h-12 w-12 rounded-full"
          source={{uri: friend.userImage}}
        />
        <Text className="text-gray-600 text-lg font-semibold dark:text-gray-400">
          {friend.userName}
        </Text>
      </View>
      <View className="ml-auto h-[1px] w-[85%] bg-gray-300 dark:bg-[#4f4f4f]" />
    </View>
  );
};

export default FriendComponent;
