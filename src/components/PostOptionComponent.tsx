import {Image, Text, TouchableOpacity, useColorScheme} from 'react-native';
import React from 'react';
import {OPTIONS_COLOR} from '../enums';
import {Option} from '../lib/options';

type Props = {
  handlePostOptionFunctions: (title: string) => void;
  postOption: Option;
};

const PostOptionComponent = ({
  handlePostOptionFunctions,
  postOption,
}: Props) => {
  const scheme = useColorScheme();

  return (
    <TouchableOpacity
      className="flex flex-row items-center mr-auto space-x-2 px-4 py-2"
      onPress={() => {
        handlePostOptionFunctions(postOption.title);
      }}>
      <Image
        className="h-6 w-6 mt-1"
        style={{
          tintColor: postOption.color
            ? postOption.color
            : scheme === 'dark'
            ? OPTIONS_COLOR.DARK_THEME_COLOR
            : OPTIONS_COLOR.LIGHT_THEME_COLOR,
        }}
        source={postOption.imageSource}
      />
      <Text
        style={{
          color: postOption.color
            ? postOption.color
            : scheme === 'dark'
            ? OPTIONS_COLOR.DARK_THEME_COLOR
            : OPTIONS_COLOR.LIGHT_THEME_COLOR,
        }}
        className="mt-1 text-lg">
        {postOption.title}
      </Text>
    </TouchableOpacity>
  );
};

export default PostOptionComponent;
