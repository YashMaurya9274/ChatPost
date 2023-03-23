import {View, ActivityIndicator, useColorScheme, FlatList} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ChatComponent from '../components/ChatComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import getChats from '../lib/getChats';
import {client} from '../lib/client';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import NoDataComponent from '../components/NoDataComponent';

export type ChatsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Chats'
>;

const ChatsScreen = () => {
  const navigation = useNavigation<ChatsScreenNavigationProp>();
  const scheme = useColorScheme();
  const isFocused = useIsFocused();
  const user = useSelector(selectUser);
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const res = await getChats(client, user.uid);
    setChats(res?.reverse());
  };

  useEffect(() => {
    if (isFocused) {
      fetchChats();
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chats',
    });
  }, [scheme]);

  const renderChats = ({item}: any) => (
    <ChatComponent key={item._id} chat={item} />
  );

  const renderEmptyChats = () => (
    <View className="bg-white h-screen flex-1 justify-center items-center dark:bg-[#151515]">
      <ActivityIndicator size="large" color="#9e6969" />
    </View>
  );

  if (chats === undefined) {
    return (
      <NoDataComponent
        title="No Chats available for you"
        subTitle="Go to your friends profile to chat...."
      />
    );
  }

  return (
    <View className="bg-white min-h-screen dark:bg-[#151515]">
      <FlatList
        data={chats}
        showsVerticalScrollIndicator={false}
        renderItem={renderChats}
        ListEmptyComponent={renderEmptyChats}
        // @ts-ignore
        keyExtractor={item => item._id}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: 15}}
      />
    </View>
  );
};

export default ChatsScreen;
