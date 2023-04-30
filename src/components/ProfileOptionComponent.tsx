import {
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import {OPTIONS_COLOR} from '../enums';

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
        style={{
          tintColor:
            scheme === 'light'
              ? OPTIONS_COLOR.LIGHT_THEME_COLOR
              : OPTIONS_COLOR.DARK_THEME_COLOR,
        }}
        source={imageSource}
        className="h-7 w-7"
      />
      <Text
        style={{
          color:
            scheme === 'light'
              ? OPTIONS_COLOR.LIGHT_THEME_COLOR
              : OPTIONS_COLOR.DARK_THEME_COLOR,
        }}
        className="text-base">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ProfileOptionComponent;
