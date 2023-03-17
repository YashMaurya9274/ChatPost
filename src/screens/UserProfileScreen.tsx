import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useLayoutEffect, useRef, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {Friend, Post, UserData} from '../types/typings';
import PostComponent from '../components/PostComponent';
import FriendComponent from '../components/FriendComponent';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
// import useFetchUserDataListener from '../hooks/useFetchUserDataListener';
import {client} from '../lib/client';
import RNBottomSheet from '../components/RNBottomSheet';
import sendFriendRequest from '../lib/sendFriendRequest';
import removeFriendRequest from '../lib/removeFriendRequest';
import getFriendRequestSentStatus from '../lib/getFriendRequestSentStatus';
import getFriendRequestReceivingStatus from '../lib/getFriendRequestReceivingStatus';
import {FRIEND_REQUEST_STATUS} from '../enums';
import acceptFriendRequest from '../lib/acceptFriendRequest';
import getFriendsStatus from '../lib/getFriendsStatus';
import unfriendFriend from '../lib/unfriendFriend';
import {selectFriendRequests} from '../slices/friendRequestsSlice';
import {manageRequests} from '../lib/manageRequests';
import getFriends from '../lib/getFriends';
import getTenUsers from '../lib/getTenUsers';
import getUserData from '../lib/getUserData';
import ImageLinks from '../assets/images';
import RandomUserComponent from '../components/RandomUserComponent';

export type UserScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UserProfile'
>;

type UserScreenRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

const UserProfileScreen = () => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const {
    params: {userId, fromFriendRequestsScreen},
  } = useRoute<UserScreenRouteProp>();
  // const {userData} = useFetchUserDataListener(client, userId);
  const [userData, setUserData] = useState<UserData>();
  const user = useSelector(selectUser);
  const [showFriends, setShowFriends] = useState(false);
  const yourAccount = userId === user.uid;
  // const friendRequestRef = useRef<FRIEND_REQUEST_STATUS | null>(null);
  const isFocused = useIsFocused();
  const friendRequests = useSelector(selectFriendRequests);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [randomUsers, setRandomUsers] = useState<Friend[]>([]);
  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FRIEND_REQUEST_STATUS | null>(null);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    const result = await getUserData(client, userId);
    setUserData(result);
  };

  useEffect(() => {
    if (yourAccount) fetchFriends();
  }, [isFocused]);

  useEffect(() => {
    if (yourAccount && friends.length === 0) fetchRandomUsers();
  }, [friends]);

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
      if (userId && !yourAccount) {
        fetchFriendRequestStatus();
      }
    }
  }, [userId, isFocused]);

  const fetchRandomUsers = async () => {
    const result = await getTenUsers(client, userId);
    setRandomUsers(result);
  };

  const fetchFriendRequestStatus = async () => {
    const friendsStatus = await getFriendsStatus(client, user.uid, userId);
    if (friendsStatus) {
      setFriendRequestStatus(friendsStatus);
    } else {
      const friendRequestReceivedStatus = await getFriendRequestReceivingStatus(
        client,
        user.uid,
        userId,
      );
      if (friendRequestReceivedStatus) {
        setFriendRequestStatus(friendRequestReceivedStatus);
      } else {
        const friendRequestSentStatus = await getFriendRequestSentStatus(
          client,
          user.uid,
          userId,
        );
        setFriendRequestStatus(friendRequestSentStatus);
      }
    }
  };

  const fetchFriends = async () => {
    const result = await getFriends(client, user.uid);
    setFriends(result!);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      //   title: userInfo?.user.userName,
      headerShown: false,
    });
  }, []);

  const getFriendRequestMessage = () => {
    switch (friendRequestStatus) {
      case FRIEND_REQUEST_STATUS.ADD_FRIEND:
        setFriendRequestStatus(FRIEND_REQUEST_STATUS.FRIEND_REQUEST_SENT);
        break;
      case FRIEND_REQUEST_STATUS.FRIEND_REQUEST_SENT:
        setFriendRequestStatus(FRIEND_REQUEST_STATUS.ADD_FRIEND);
        break;
      case FRIEND_REQUEST_STATUS.ACCEPT_REQUEST:
        setFriendRequestStatus(FRIEND_REQUEST_STATUS.UNFRIEND);
        break;
      case FRIEND_REQUEST_STATUS.UNFRIEND:
        setFriendRequestStatus(FRIEND_REQUEST_STATUS.ADD_FRIEND);
        break;
      default:
        break;
    }
  };

  const navigateToUserProfile = (userId: string) => {
    setShowFriends(false);
    navigation.push('UserProfile', {
      userId,
    });
  };

  const handleAddFriendClick = async () => {
    const reqMessage = friendRequestStatus;

    getFriendRequestMessage();

    const requestReceiverUser: any = {
      _ref:
        reqMessage === FRIEND_REQUEST_STATUS.ACCEPT_REQUEST
          ? user.uid
          : userData?._id!,
      _type: 'reference',
    };

    const requestSenderUser: any = {
      _ref:
        reqMessage === FRIEND_REQUEST_STATUS.ACCEPT_REQUEST
          ? userData?._id!
          : user.uid,
      _type: 'reference',
    };

    if (reqMessage === FRIEND_REQUEST_STATUS.ADD_FRIEND) {
      await sendFriendRequest(
        client,
        user.uid,
        userData?._id!,
        requestReceiverUser,
        requestSenderUser,
      );
    } else if (reqMessage === FRIEND_REQUEST_STATUS.FRIEND_REQUEST_SENT) {
      await removeFriendRequest(client, user.uid, userData?._id!);
    } else if (reqMessage === FRIEND_REQUEST_STATUS.ACCEPT_REQUEST) {
      if (fromFriendRequestsScreen) {
        manageRequests(userId, friendRequests, dispatch);
      }

      await acceptFriendRequest(
        client,
        userData?._id!,
        user.uid,
        requestReceiverUser,
        requestSenderUser,
      );
    } else if (reqMessage === FRIEND_REQUEST_STATUS.UNFRIEND) {
      await unfriendFriend(client, user.uid, userData?._id!);
    }
  };

  const navigateToFriendRequest = () => {
    setShowFriends(false);
    navigation.push('FriendRequest');
  };

  const renderEmptyFriendsListComponent = () => {
    return (
      <View className="space-y-8">
        <View className="mt-6">
          <Text className="font-bold text-gray-600 dark:text-gray-200 text-xl text-center">
            You have no Friends :(
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-200 text-center mt-2">
            Let's make some new friends..
          </Text>
        </View>

        <ScrollView
          horizontal
          bounces
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{padding: 10, alignItems: 'center'}}
          className="space-x-4">
          {randomUsers.map(user => (
            <RandomUserComponent
              key={user._id}
              user={user}
              navigateToUserProfile={navigateToUserProfile}
            />
          ))}

          <TouchableOpacity
            onPress={navigateToFriendRequest}
            className="flex flex-row items-center p-3 bg-[#9e6969] rounded-lg space-x-3 h-10">
            {/* <Text>Search</Text> */}
            <Image source={ImageLinks.searchIcon} className="h-6 w-6" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  if (!userData || (!yourAccount && friendRequestStatus === null))
    return (
      <ActivityIndicator
        className="h-screen bg-white relative dark:bg-[#151515]"
        size="large"
        color="#9e6969"
      />
    );

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 15}}
      className="bg-white relative dark:bg-[#151515]">
      <StatusBar barStyle="light-content" backgroundColor="#4c3737" />
      <Image
        resizeMode="contain"
        className="h-20 w-20 absolute z-10 top-5 rounded-full ml-3"
        source={{uri: userData?.photoURL}}
      />

      <View className="h-16 bg-[#4c3737]">
        <Text className="mt-auto ml-[100px] text-white mb-1 font-bold text-lg">
          {userData?.displayName}
        </Text>
      </View>

      <Text className="ml-[100px] text-base text-gray-600 dark:text-gray-400">
        {userData?.posts?.length! > 0 && userData?.posts?.length}
        {userData?.posts?.length === 0
          ? 'No Posts'
          : userData?.posts?.length === 1
          ? ' Post'
          : ' Posts'}
      </Text>

      {/* TODO: Check if it's your profile and show buttons accordingly */}
      <View className="flex justify-evenly flex-row mt-8 w-full">
        {yourAccount ? (
          <>
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => setShowFriends(true)}
              className="bg-[#694242] border p-2 w-[40%] rounded-md">
              <Text className="text-center font-bold text-white">
                See Your Friends
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.2}
              className="border border-[#694242] p-2 w-[40%] rounded-md dark:border-[#9e6969]">
              <Text className="text-center text-[#694242] font-bold dark:text-[#9e6969]">
                See Your Groups
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={handleAddFriendClick}
              className="bg-[#694242] border p-2 w-[40%] rounded-md">
              <Text className="text-center font-bold text-white">
                {friendRequestStatus}
              </Text>
            </TouchableOpacity>
            {friendRequestStatus === FRIEND_REQUEST_STATUS.UNFRIEND && (
              <TouchableOpacity
                activeOpacity={0.2}
                className="border border-[#694242] p-2 w-[40%] rounded-md dark:border-[#9e6969]">
                <Text className="text-center text-[#694242] font-bold dark:text-[#9e6969]">
                  Add To Group
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <View>
        {userData?.posts?.map((post: Post) => (
          <PostComponent
            key={post._id}
            post={post}
            fromUserProfileScreen={true}
          />
        ))}
      </View>

      <RNBottomSheet
        isVisible={showFriends}
        onBackdropPress={() => setShowFriends(false)}
        bottomSheetHeight={400}>
        {friends.length !== 0 ? (
          <ScrollView
            bounces
            contentContainerStyle={{paddingBottom: 10}}
            className="h-[310px]"
            showsVerticalScrollIndicator={false}>
            {friends.map((friend: Friend) => (
              <FriendComponent
                navigateToUserProfile={navigateToUserProfile}
                key={friend._id}
                friend={friend}
              />
            ))}
          </ScrollView>
        ) : (
          renderEmptyFriendsListComponent()
        )}
      </RNBottomSheet>
    </ScrollView>
  );
};

export default UserProfileScreen;
