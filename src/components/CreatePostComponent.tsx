import {TouchableOpacity, Text} from 'react-native';
import React from 'react';

const CreatePostComponent = () => {
  return (
    <TouchableOpacity className="px-5 py-3">
      <Text className="border border-[#9e6969] text-[#9e6969] dark:text-[#bb9090] px-3 py-2 rounded-full mr-auto bg-[#9e6969]/30">
        Create a new Post
      </Text>
    </TouchableOpacity>
  );
};

export default CreatePostComponent;
