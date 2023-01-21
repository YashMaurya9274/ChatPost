import {View, ScrollView, useColorScheme} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Chat} from '../types/typings';
import ChatComponent from '../components/ChatComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';

const chats: Chat[] = [
  {
    id: '1',
    friendName: 'Tony',
    friendImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
    messages: [
      {
        id: 'a',
        message: 'Hello 1',
        timestamp: Date.now(),
        userName: 'Tony',
        userImage:
          'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
      },
      {
        id: 'b',
        message: 'Hello 2',
        timestamp: Date.now(),
        userName: 'Tony',
        userImage:
          'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
      },
      {
        id: 'c',
        message: 'Genius Billionaire 😎 Playboy Philanthrophist',
        timestamp: Date.now(),
        userName: 'Tony',
        userImage:
          'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
      },
      {
        id: 'd',
        message: 'Genius Billionaire 😎 Playboy Philanthrophist',
        timestamp: Date.now(),
        userName: 'Tony',
        userImage:
          'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
      },
      {
        id: 'e',
        message: 'Genius Billionaire 😎 Playboy Philanthrophist',
        timestamp: Date.now(),
        userName: 'Tony',
        userImage:
          'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
      },
      {
        id: 'f',
        message: 'Genius Billionaire 😎 Playboy Philanthrophist',
        timestamp: Date.now(),
        userName: 'Tony',
        userImage:
          'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
      },
      {
        id: 'g',
        message: 'Genius Billionaire 😎 Playboy Philanthrophist',
        timestamp: Date.now(),
        userName: 'Tony',
        userImage:
          'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
      },
    ],
  },
  {
    id: '2',
    friendName: 'Steve',
    friendImage:
      'https://netflixjunkie.com/wp-content/uploads/2022/05/captain-america-chris-evans.jpg',
    messages: [
      {
        id: 'a',
        message: 'Hello 1',
        timestamp: Date.now(),
        userName: 'Steve',
        userImage:
          'https://netflixjunkie.com/wp-content/uploads/2022/05/captain-america-chris-evans.jpg',
      },
      {
        id: 'b',
        message: 'Hello 2',
        timestamp: Date.now(),
        userName: 'Steve',
        userImage:
          'https://netflixjunkie.com/wp-content/uploads/2022/05/captain-america-chris-evans.jpg',
      },
      {
        id: 'c',
        message: 'Avengers Assemble Yyeeeeeaaaahhhhhhhhh',
        timestamp: Date.now(),
        userName: 'Steve',
        userImage:
          'https://netflixjunkie.com/wp-content/uploads/2022/05/captain-america-chris-evans.jpg',
      },
    ],
  },
];

export type ChatsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Chats'
>;

const ChatsScreen = () => {
  const navigation = useNavigation<ChatsScreenNavigationProp>();
  const scheme = useColorScheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chats',
    });
  }, [scheme]);

  return (
    <View className="bg-white min-h-screen dark:bg-[#151515]">
      <ScrollView bounces className="pb-5">
        {chats.map((chat: Chat) => (
          <ChatComponent key={chat.id} chat={chat} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ChatsScreen;
