import {TouchableOpacity, Text, Image} from 'react-native';
import React from 'react';

type Props = {
  user: Friend;
  navigateToUserProfile: (userId: string) => void;
};

const RandomUserComponent = ({user, navigateToUserProfile}: Props) => {
  return (
    <TouchableOpacity
      onPress={() => navigateToUserProfile(user._id!)}
      key={user._id}
      style={{
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
      }}
      className="w-36 mx-2 rounded-b-lg rounded-t-lg bg-white dark:bg-[#282828]">
      <Image
        source={{uri: user.photoURL}}
        resizeMode="stretch"
        className="h-24 w-full rounded-t-lg"
      />
      <Text className="text-[15px] mx-1 text-gray-600 dark:text-gray-200 text-center mt-2">
        {user.displayName}
      </Text>

      <TouchableOpacity
        className="bg-[#9e6969] p-2 mx-auto rounded-md m-2 mt-3"
        onPress={() => {}}>
        <Text className="text-center font-bold text-white">Add Friend</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default RandomUserComponent;
