import {View, FlatList, useColorScheme} from 'react-native';
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import getSentRequests from '../lib/getSentRequests';
import {client} from '../lib/client';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import LoaderComponent from '../components/LoaderComponent';
import NoDataComponent from '../components/NoDataComponent';
import UserComponent from '../components/UserComponent';
import removeFriendRequest from '../lib/removeFriendRequest';

export type ManageSentRequestsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ManageSentRequests'
>;

const ManageSentRequestsScreen = () => {
  const navigation = useNavigation<ManageSentRequestsScreenNavigationProp>();
  const scheme = useColorScheme();
  const [sentRequests, setSentRequests] = useState<
    FriendRequest[] | undefined
  >();
  const isFocused = useIsFocused();
  const user = useSelector(selectUser);

  const fetchSentRequests = async () => {
    const result = await getSentRequests(client, user.uid);
    setSentRequests(result);
  };

  useEffect(() => {
    if (isFocused) {
      fetchSentRequests();
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Your Sent Requests',
    });
  }, []);

  const navigateToUserProfile = (userId: string) => {
    navigation.push('UserProfile', {
      userId,
      fromFriendRequestsScreen: true,
    });
  };

  const handleRemoveRequestClicked = async (requestId: string) => {
    let newRequests = sentRequests;
    const requestIndex = newRequests?.findIndex(req => req._id === requestId);

    newRequests = [
      ...newRequests?.slice(0, requestIndex)!,
      ...newRequests?.slice(requestIndex! + 1)!,
    ];
    setSentRequests(newRequests);

    await removeFriendRequest(client, user.uid, requestId);
  };

  const renderEmptyChats = () => <LoaderComponent />;

  //   if (sentRequests === undefined) {
  //     return <LoaderComponent />;
  //   }

  if (sentRequests?.length === 0) {
    return (
      <View className="bg-white h-screen flex-1 justify-center items-center dark:bg-[#151515]">
        <NoDataComponent
          title="No Sent Requests available."
          subTitle="Send some friend requests and them come back...."
        />
      </View>
    );
  }

  const renderRequest = ({item}: any) => (
    <UserComponent
      key={item._id}
      user={item}
      navigateToUserProfile={navigateToUserProfile}
      handleRemoveRequestClicked={handleRemoveRequestClicked}
    />
  );

  return (
    <View className="bg-white min-h-full dark:bg-[#151515]">
      <FlatList
        data={sentRequests}
        contentContainerStyle={{paddingTop: 15}} // Messages are reversed so paddingTop will work as paddingBottom
        renderItem={renderRequest}
        ListEmptyComponent={renderEmptyChats}
        // @ts-ignore
        keyExtractor={item => item._id}
      />
    </View>
  );
};

export default ManageSentRequestsScreen;
