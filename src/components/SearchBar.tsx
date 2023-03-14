import {
  View,
  Image,
  TextInput,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import ImageLinks from '../assets/images';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onCancelPress: () => void;
};

const SearchBar = ({value, onChangeText, onCancelPress}: Props) => {
  const scheme = useColorScheme();

  return (
    <View className="flex flex-row w-[95%] mx-auto items-center bg-gray-200/70 dark:bg-[#282828] px-3 py-1 rounded-full mt-5">
      <Image
        source={ImageLinks.searchIcon}
        className="h-5 w-5"
        style={{tintColor: scheme == 'dark' ? 'gray' : '#a7a7a7'}}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search Here...."
        placeholderTextColor="gray"
        className="ml-1 text-gray-600 dark:text-gray-300 text-base p-1 flex-1"
      />
      {value && (
        <TouchableOpacity onPress={onCancelPress}>
          <Image
            source={ImageLinks.cross}
            className="h-5 w-5"
            style={{tintColor: scheme == 'dark' ? 'gray' : '#a7a7a7'}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
