import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import React from 'react';
import ImageLinks from '../assets/images';

type Props = {
  user: {
    _id: string;
    displayName: string;
    photoURL: string;
  };
  navigateToUserProfile: (userId: string) => void;
};

const SearchUserResultComponent = ({user, navigateToUserProfile}: Props) => {
  const scheme = useColorScheme();

  return (
    <TouchableOpacity
      key={user._id}
      onPress={() => navigateToUserProfile(user._id)}
      className="flex flex-row justify-between my-2 items-center px-3 mb-4">
      <View className="flex flex-row items-center space-x-3">
        <Image
          source={{uri: user.photoURL}}
          className="h-10 w-10 rounded-full"
        />
        <Text className="text-[17px] mb-2 text-gray-700 dark:text-gray-300">
          {user.displayName}
        </Text>
      </View>

      <Image
        source={ImageLinks.chevron.chevronRight}
        style={{tintColor: scheme === 'dark' ? '#545454' : '#D2D2D2'}}
        className="h-5 w-5"
      />
    </TouchableOpacity>
  );
};

export default SearchUserResultComponent;
