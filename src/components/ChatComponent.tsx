import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Chat} from '../../typings';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';

export type MessageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Messages'
>;

type Props = {
  chat: Chat;
};

const ChatComponent = ({chat}: Props) => {
  const navigation = useNavigation<MessageScreenNavigationProp>();
  const notSeen = true;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Messages', {
          messages: chat.messages,
        })
      }
      activeOpacity={0.7}
      className="bg-[#E9E9E9] p-3 rounded-lg mx-2 mt-3 dark:bg-gray-800">
      <View className="flex flex-row items-center space-x-3">
        <Image
          className="h-11 w-11 rounded-full"
          source={{uri: chat.friendImage}}
        />
        <View>
          <Text className="text-gray-900 text-base font-bold dark:text-gray-300">
            {chat.friendName}
          </Text>
          <Text
            numberOfLines={1}
            className={`text-gray-600 w-64 dark:text-gray-400 ${
              notSeen && 'font-bold'
            }`}>
            {chat.messages[chat.messages.length - 1].message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatComponent;
