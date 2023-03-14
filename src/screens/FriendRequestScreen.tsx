import {View, Text, StatusBar, useColorScheme, FlatList} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {RootStackParamList} from '../navigator/RootNavigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SearchBar from '../components/SearchBar';
import FriendRequestComponent from '../components/FriendRequestComponent';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import acceptFriendRequest from '../lib/acceptFriendRequest';
import removeFriendRequest from '../lib/removeFriendRequest';
import {client} from '../lib/client';
import getAllUsers from '../lib/getAllUsers';
import SearchUserResultComponent from '../components/SearchUserResultComponent';
import {
  selectFriendRequests,
  setFriendRequests,
} from '../slices/friendRequestsSlice';
import {manageRequests} from '../lib/manageRequests';

export type FriendRequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FriendRequest'
>;

type SearchUser = {
  _id: string;
  displayName: string;
  photoURL: string;
};

const FriendRequestScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<SearchUser[] | undefined>(
    [],
  );
  const friendRequests = useSelector(selectFriendRequests);

  const scheme = useColorScheme();
  const user = useSelector(selectUser);
  const navigation = useNavigation<FriendRequestScreenNavigationProp>();
  const dispatch = useDispatch();

  const fetchAllUsers = async () => {
    const resultUsers = await getAllUsers(client);
    setUsers(resultUsers);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (searchText) {
      const res = users.filter(user => {
        if (user.displayName.includes(searchText)) return user;
      });
      if (res.length > 0) setSearchedUsers(res);
      else setSearchedUsers(undefined);
    }
  }, [searchText]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const navigateToUserProfile = (userId: string) => {
    navigation.navigate('UserProfile', {
      userId,
      fromFriendRequestsScreen: true,
    });
  };

  const handleAcceptRequestClicked = async (reqSenderId: string) => {
    manageRequests(reqSenderId, friendRequests, dispatch);

    const requestReceiverUser: any = {
      _ref: user.uid,
      _type: 'reference',
    };

    const requestSenderUser: any = {
      _ref: reqSenderId,
      _type: 'reference',
    };

    await acceptFriendRequest(
      client,
      reqSenderId,
      user.uid,
      requestReceiverUser,
      requestSenderUser,
    );
  };

  const handleRemoveRequestClicked = async (reqSenderId: string) => {
    manageRequests(reqSenderId, friendRequests, dispatch);

    await removeFriendRequest(client, reqSenderId, user.uid);
  };

  const renderFriendRequest = ({item}: any) => (
    <FriendRequestComponent
      key={item._id}
      friendRequest={item}
      navigateToUserProfile={navigateToUserProfile}
      handleAcceptRequestClicked={handleAcceptRequestClicked}
      handleRemoveRequestClicked={handleRemoveRequestClicked}
    />
  );

  const renderNoFriendRequest = () => (
    <View className="flex h-screen justify-center items-center">
      <Text className="font-bold text-gray-600 dark:text-gray-200 text-xl text-center">
        No Friend Requests
      </Text>
      <Text className="text-base text-gray-600 dark:text-gray-200 text-center mt-2 mb-32">
        Tap on the Search bar to make new friends....
      </Text>
    </View>
  );

  const renderSearchUserResults = ({item}: any) => (
    <SearchUserResultComponent
      key={item?._id}
      user={item!}
      navigateToUserProfile={navigateToUserProfile}
    />
  );

  const renderNoSearchUserResults = () => (
    <View className="flex h-40 justify-center items-center">
      <Text className="font-semibold text-gray-600 dark:text-gray-200 text-lg text-center">
        No Search Results to show !!
      </Text>
    </View>
  );

  return (
    <View className="bg-white min-h-full dark:bg-[#151515]">
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={scheme === 'dark' ? '#151515' : 'white'}
      />

      <SearchBar
        value={searchText}
        onChangeText={(text: string) => setSearchText(text)}
        onCancelPress={() => setSearchText('')}
      />

      <Text className="text-xl text-gray-600 dark:text-gray-300 mt-5 mb-1 ml-4">
        {searchText ? 'Search Results' : 'Requests'}
      </Text>

      <View className="bg-gray-200 dark:bg-[#323232] mx-auto w-[95%] h-[1px] mb-3" />

      {searchText ? (
        <FlatList
          data={searchedUsers}
          renderItem={renderSearchUserResults}
          ListEmptyComponent={renderNoSearchUserResults}
          // @ts-ignore
          keyExtractor={item => item?._id}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingBottom: 15}}
        />
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={renderFriendRequest}
          ListEmptyComponent={renderNoFriendRequest}
          // @ts-ignore
          keyExtractor={item => item._id}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingBottom: 15}}
        />
      )}
    </View>
  );
};

export default FriendRequestScreen;
