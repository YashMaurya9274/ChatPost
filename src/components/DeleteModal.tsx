import {View, TouchableOpacity, Text, useColorScheme} from 'react-native';
import React from 'react';
import {Overlay} from '@rneui/themed';

type Props = {
  showDeleteBox: boolean;
  onBackDropPress: () => void;
  handleDeletePost: () => Promise<void>;
};

const DeleteModal = ({
  showDeleteBox,
  onBackDropPress,
  handleDeletePost,
}: Props) => {
  const scheme = useColorScheme();

  return (
    <Overlay
      overlayStyle={{
        backgroundColor: scheme === 'dark' ? '#262626' : '#ebedef',
        paddingHorizontal: 30,
        paddingVertical: 20,
        width: 300,
        borderRadius: 10,
      }}
      onBackdropPress={onBackDropPress}
      isVisible={showDeleteBox}
      animationType="fade">
      <Text className="text-gray-500 dark:text-gray-400 font-semibold text-lg mb-4">
        Post will be permanently deleted.
      </Text>
      <Text className="text-gray-500 text-base dark:text-gray-400 mb-4">
        Are you sure you want to delete it?
      </Text>
      <View className="flex flex-row justify-evenly space-x-4 items-center">
        <TouchableOpacity
          className="bg-[#FF5959] w-24 items-center rounded-lg px-3 py-2"
          onPress={handleDeletePost}>
          <Text className="text-white">Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-[#FF5959] w-24 items-center rounded-lg px-3 py-2"
          onPress={onBackDropPress}>
          <Text className="text-[#FF5959]">Cancel</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
};

export default DeleteModal;
