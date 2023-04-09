import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';

type Props = {
  friendRequest: FriendRequest;
  navigateToUserProfile: (userId: string) => void;
  handleAcceptRequestClicked: (reqSenderId: string) => Promise<void>;
  handleRemoveRequestClicked: (reqSenderId: string) => Promise<void>;
};

const FriendRequestComponent = ({
  friendRequest,
  navigateToUserProfile,
  handleAcceptRequestClicked,
  handleRemoveRequestClicked,
}: Props) => {
  return (
    <View
      key={friendRequest._id}
      className="flex flex-row space-x-3 items-center px-3 mb-3">
      <TouchableOpacity
        onPress={() => navigateToUserProfile(friendRequest._id!)}>
        <Image
          source={{uri: friendRequest.photoURL}}
          className="h-14 w-14 rounded-xl"
        />
      </TouchableOpacity>

      <View>
        <TouchableOpacity
          className="mr-auto max-w-[250px]"
          onPress={() => navigateToUserProfile(friendRequest._id!)}>
          <Text className="text-[17px] mb-2 text-gray-700 dark:text-gray-300">
            {friendRequest.displayName}
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row space-x-3">
          <TouchableOpacity
            onPress={() => handleAcceptRequestClicked(friendRequest._id!)}
            className="bg-[#694242] px-8 py-2 rounded-md dark:bg-[#9e6969]">
            <Text className="text-center text-white font-bold">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemoveRequestClicked(friendRequest._id!)}
            className="border border-[#694242] px-8 py-2 rounded-md dark:border-[#9e6969]">
            <Text className="text-center text-[#694242] font-bold dark:text-[#9e6969]">
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FriendRequestComponent;
