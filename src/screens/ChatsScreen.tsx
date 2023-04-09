import {
  View,
  ActivityIndicator,
  useColorScheme,
  FlatList,
  StatusBar,
} from 'react-native';
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
import LoaderComponent from '../components/LoaderComponent';

export type ChatsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Chats'
>;

const ChatsScreen = () => {
  const navigation = useNavigation<ChatsScreenNavigationProp>();
  const scheme = useColorScheme();
  const isFocused = useIsFocused();
  const user = useSelector(selectUser);
  const [chats, setChats] = useState<Chat[] | undefined>();

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

  const renderEmptyChats = () => <LoaderComponent />;

  if (chats === undefined) {
    return <LoaderComponent />;
  }

  if (chats.length === 0) {
    return (
      <View className="bg-white h-screen flex-1 justify-center items-center dark:bg-[#151515]">
        <NoDataComponent
          title="No Chats available for you"
          subTitle="Go to your friends profile to chat...."
        />
      </View>
    );
  }

  return (
    <View className="bg-white min-h-screen dark:bg-[#151515]">
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={scheme === 'dark' ? '#151515' : 'white'}
      />
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
