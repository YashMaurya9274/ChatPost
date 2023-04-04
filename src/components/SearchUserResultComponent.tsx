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
  userImageHeight?: number;
  userImageWidth?: number;
};

const SearchUserResultComponent = ({
  user,
  navigateToUserProfile,
  userImageHeight = 40,
  userImageWidth = 40,
}: Props) => {
  const scheme = useColorScheme();

  return (
    <TouchableOpacity
      key={user._id}
      onPress={() => navigateToUserProfile(user._id)}
      className="flex flex-row justify-between my-2 items-center px-3 mb-4">
      <View className="flex flex-row items-center space-x-3">
        <Image
          source={{uri: user.photoURL}}
          style={{width: userImageWidth, height: userImageHeight}}
          className="rounded-full"
        />
        <Text className="text-[17px] mb-1 text-gray-700 dark:text-gray-300">
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
