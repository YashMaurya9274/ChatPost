import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
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
import getChat from '../lib/getChat';
import DeleteModal from '../components/DeleteModal';
import deletePost from '../lib/deletePost';

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
  const myAccount = userId === user.uid;
  const isFocused = useIsFocused();
  const friendRequests = useSelector(selectFriendRequests);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [randomUsers, setRandomUsers] = useState<Friend[]>([]);
  const [chatId, setChatId] = useState<string>('');
  const [showDeleteBox, setShowDeleteBox] = useState<boolean>(false);
  const [postIdForDeletion, setPostIdForDeletion] = useState<string>('');
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const [existingMessages, setExistingMessages] = useState<
    Message[] | undefined
  >();
  const [notSeenCount, setNotSeenCount] = useState<number>(0);
  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FRIEND_REQUEST_STATUS | null>(null);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    const result = await getUserData(client, userId);
    setUserData(result);
    setUserPosts(result?.posts);
  };

  useEffect(() => {
    if (myAccount) {
      fetchFriends();
    }
  }, [isFocused]);

  useEffect(() => {
    if (myAccount && friends.length === 0) fetchRandomUsers();
  }, [friends]);

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
      if (userId && !myAccount) {
        fetchFriendRequestStatus();
        fetchChat();
      }
    }
  }, [userId, isFocused]);

  const countNotSeenMessages = () => {
    if (existingMessages) {
      // FINDING HOW MANY MESSAGES ARE UNSEEN
      const unseenMessageSender = existingMessages.filter(
        message => !message.seen,
      );

      // CHECKING IF THE ID OF THE SENDER IS SIMILAR TO THE LOGGED IN USER
      if (unseenMessageSender[0]?.user?._id !== user.uid) {
        setNotSeenCount(unseenMessageSender.length);
      }
    }
  };

  // CALCULATE TOTAL UNSEEN MESSAGES IF THERE IS AN EXISTING CHAT FOR BOTH THE USERS
  useEffect(() => {
    countNotSeenMessages();
  }, [existingMessages]);

  const fetchRandomUsers = async () => {
    const result = await getTenUsers(client, userId);
    setRandomUsers(result);
  };

  const fetchChat = async (friendId?: string) => {
    let tempId: string;
    if (myAccount) {
      tempId = friendId!;
    } else {
      tempId = userId;
    }
    const result = await getChat(client, user.uid, tempId);
    setChatId(result?._id);
    setExistingMessages(result?.messages);

    return result?.messages?.reverse();
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

  const navigateToMessageScreen = async (
    friendId?: string,
    friendDisplayName?: string,
    friendPhotoURL?: string,
  ) => {
    if (myAccount) {
      await fetchChat(friendId).then((messgs: any) => {
        navigation.push('Messages', {
          chatId: chatId,
          friendId: friendId!,
          messages: messgs,
          friendImage: friendPhotoURL!,
          friendName: friendDisplayName!,
          notSeenCount: notSeenCount,
        });
      });
    } else {
      navigation.push('Messages', {
        chatId: chatId,
        friendId: userId,
        messages: existingMessages!,
        friendImage: userData?.photoURL!,
        friendName: userData?.displayName!,
        notSeenCount: notSeenCount,
      });
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

  const displayDeleteModal = (postId: string) => {
    setPostIdForDeletion(postId);
    setShowDeleteBox(true);
  };

  const handleDeletePost = async () => {
    if (postIdForDeletion) {
      let newPosts = userPosts;
      const postIndex = newPosts.findIndex(
        post => post._id === postIdForDeletion,
      );
      newPosts = [
        ...newPosts.slice(0, postIndex),
        ...newPosts.slice(postIndex + 1),
      ];
      setUserPosts(newPosts);
      setShowDeleteBox(false);
      await deletePost(postIdForDeletion);
    }
  };

  if (!userData || (!myAccount && friendRequestStatus === null))
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
        {userPosts?.length! > 0 && userPosts?.length}
        {userPosts?.length === 0
          ? 'No Posts'
          : userPosts?.length === 1
          ? ' Post'
          : ' Posts'}
      </Text>

      {/* TODO: Check if it's your profile and show buttons accordingly */}
      <View className="flex justify-evenly flex-row mt-8 w-full">
        {myAccount ? (
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
                onPress={() => navigateToMessageScreen()}
                activeOpacity={0.2}
                className="border border-[#694242] p-2 w-[40%] rounded-md dark:border-[#9e6969]">
                <Text className="text-center text-[#694242] font-bold dark:text-[#9e6969]">
                  Message
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <View>
        {userPosts?.map((post: Post) => (
          <PostComponent
            key={post._id}
            post={post}
            fromUserProfileScreen={true}
            displayDeleteModal={displayDeleteModal}
          />
        ))}
      </View>

      <DeleteModal
        showDeleteBox={showDeleteBox}
        onBackDropPress={() => setShowDeleteBox(false)}
        handleDeletePost={handleDeletePost}
      />

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
                key={friend._id}
                navigateToMessageScreen={navigateToMessageScreen}
                navigateToUserProfile={navigateToUserProfile}
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
