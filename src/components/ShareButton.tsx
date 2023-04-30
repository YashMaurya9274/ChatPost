import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import ImageLinks from '../assets/images';

type Props = {
  onPress: () => Promise<void>;
  style?: StyleProp<ViewStyle>;
};

const ShareButton = ({onPress, style}: Props) => {
  const scheme = useColorScheme();

  return (
    <TouchableOpacity
      style={style}
      className="p-[8px] bg-gray-300/90 dark:bg-gray-400/20 rounded-full"
      onPress={onPress}>
      <Image
        source={ImageLinks.share.shareThreeDots}
        style={{tintColor: scheme === 'light' ? '#4B5558' : '#E6E6E6'}}
        className="h-5 w-5 mx-auto"
      />
    </TouchableOpacity>
  );
};

export default ShareButton;
