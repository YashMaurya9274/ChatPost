import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';

type Props = {
  friend: Friend;
  navigateToUserProfile: (userId: string) => void;
};

const FriendComponent = ({friend, navigateToUserProfile}: Props) => {
  return (
    <View className="flex flex-row items-center justify-between px-4 py-3">
      <View className="flex flex-row items-center space-x-3 flex-1">
        <Image
          className="h-8 w-8 rounded-full"
          source={{uri: friend.photoURL}}
        />
        <Text className="text-gray-600 w-[75%] text-base dark:text-gray-200">
          {friend.displayName}
        </Text>
      </View>

      <View className="flex flex-row items-center space-x-3">
        <TouchableOpacity className="bg-[#9e6969] px-3 py-2 rounded-lg">
          <Text className="text-white text-xs">Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigateToUserProfile(friend._id!)}
          className="bg-[#9e6969] px-3 py-2 rounded-lg">
          <Text className="text-white text-xs">View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendComponent;
