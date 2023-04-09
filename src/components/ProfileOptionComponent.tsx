import {
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';

type Props = {
  title: string;
  imageSource: ImageSourcePropType;
  handleNavigation: (title: string) => void;
};

const ProfileOptionComponent = ({
  title,
  imageSource,
  handleNavigation,
}: Props) => {
  const scheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => handleNavigation(title)}
      className="flex flex-row items-center space-x-3 px-3 py-1 mb-2">
      <Image
        style={{tintColor: scheme === 'light' ? '#646d7a' : '#BFBFBF'}}
        source={imageSource}
        className="h-7 w-7"
      />
      <Text className="text-base text-[#646d7a] dark:text-[#BFBFBF]">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ProfileOptionComponent;
