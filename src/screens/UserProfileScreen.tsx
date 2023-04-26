import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  useColorScheme,
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
import {Overlay} from '@rneui/themed';
import SearchBar from '../components/SearchBar';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share, {ShareOptions} from 'react-native-share';
import {appName} from '../constants';

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
  const scheme = useColorScheme();
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
  const [disableRefreshRandomUsers, setDisableRefreshRandomUsers] =
    useState<boolean>(false);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [searchFriendsValue, setSearchFriendsValue] = useState<string>('');
  const [searchFriendsResult, setSearchFriendsResult] = useState<
    Friend[] | undefined
  >();

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

  useEffect(() => {
    if (searchFriendsValue) {
      const res = friends.filter(friend => {
        if (friend.displayName.includes(searchFriendsValue)) return friend;
      });
      if (res.length > 0) setSearchFriendsResult(res);
      else setSearchFriendsResult(undefined);
    }
  }, [searchFriendsValue]);

  // CALCULATE TOTAL UNSEEN MESSAGES IF THERE IS AN EXISTING CHAT FOR BOTH THE USERS
  useEffect(() => {
    countNotSeenMessages();
  }, [existingMessages]);

  const fetchRandomUsers = async () => {
    setDisableRefreshRandomUsers(true);
    const result = await getTenUsers(client, userId);
    setRandomUsers(result);
    setDisableRefreshRandomUsers(false);
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

  const getFriendRequestMessage = (
    requestStatus: FRIEND_REQUEST_STATUS | null,
  ) => {
    switch (requestStatus) {
      case FRIEND_REQUEST_STATUS.ADD_FRIEND:
        return FRIEND_REQUEST_STATUS.FRIEND_REQUEST_SENT;
      case FRIEND_REQUEST_STATUS.FRIEND_REQUEST_SENT:
        return FRIEND_REQUEST_STATUS.ADD_FRIEND;
      case FRIEND_REQUEST_STATUS.ACCEPT_REQUEST:
        return FRIEND_REQUEST_STATUS.UNFRIEND;
      case FRIEND_REQUEST_STATUS.UNFRIEND:
        return FRIEND_REQUEST_STATUS.ADD_FRIEND;
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

  const initiateRequestProcess = async (
    reqMessage: FRIEND_REQUEST_STATUS | null,
    currentUserId: string,
    otherUserId: string,
  ) => {
    const requestReceiverUser: any = {
      _ref:
        reqMessage === FRIEND_REQUEST_STATUS.ACCEPT_REQUEST
          ? currentUserId
          : otherUserId,
      _type: 'reference',
    };

    const requestSenderUser: any = {
      _ref:
        reqMessage === FRIEND_REQUEST_STATUS.ACCEPT_REQUEST
          ? otherUserId
          : currentUserId,
      _type: 'reference',
    };

    if (reqMessage === FRIEND_REQUEST_STATUS.ADD_FRIEND) {
      await sendFriendRequest(
        client,
        currentUserId,
        otherUserId,
        requestReceiverUser,
        requestSenderUser,
      );
    } else if (reqMessage === FRIEND_REQUEST_STATUS.FRIEND_REQUEST_SENT) {
      await removeFriendRequest(client, currentUserId, otherUserId);
    } else if (reqMessage === FRIEND_REQUEST_STATUS.ACCEPT_REQUEST) {
      if (fromFriendRequestsScreen) {
        manageRequests(otherUserId, friendRequests, dispatch);
      }

      await acceptFriendRequest(
        client,
        otherUserId,
        currentUserId,
        requestReceiverUser,
        requestSenderUser,
      );
    } else if (reqMessage === FRIEND_REQUEST_STATUS.UNFRIEND) {
      await unfriendFriend(client, user.uid, otherUserId);
    }
  };

  const handleAddFriendClick = async () => {
    const reqMessage = friendRequestStatus;

    const res = getFriendRequestMessage(friendRequestStatus);
    setFriendRequestStatus(res!);

    initiateRequestProcess(reqMessage, user.uid, userId);
  };

  const navigateToMessageScreen = async (
    friendId?: string,
    friendDisplayName?: string,
    friendPhotoURL?: string,
  ) => {
    setShowFriends(false);
    if (myAccount) {
      setMessagesLoading(true);
      await fetchChat(friendId).then((messgs: any) => {
        setMessagesLoading(false);
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
      <View className="space-y-6">
        <View className="mt-6">
          <Text className="font-bold text-gray-600 dark:text-gray-200 text-xl text-center">
            You have no Friends :(
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-200 text-center mt-2">
            Let's make some new friends..
          </Text>
        </View>

        <TouchableOpacity
          disabled={disableRefreshRandomUsers}
          onPress={fetchRandomUsers}
          className={`flex flex-row items-center space-x-2 ml-auto mr-5 px-3 py-2 rounded-lg bg-gray-200 dark:bg-[#383838] ${
            disableRefreshRandomUsers && 'opacity-30'
          }`}>
          <Image
            source={ImageLinks.reload}
            style={{tintColor: scheme === 'dark' ? '#e6e6e6' : '#4B5558'}}
            className="h-5 w-5"
          />
          <Text className="text-base text-gray-600 dark:text-gray-200">
            Refresh
          </Text>
        </TouchableOpacity>

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
              getFriendRequestMessage={getFriendRequestMessage}
              initiateRequestProcess={initiateRequestProcess}
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

  async function buildProfileLink() {
    const link = await dynamicLinks().buildLink({
      link: `https://chatpost/profile/${userId}`,
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://chatpost.page.link',
      android: {
        packageName: 'com.chatpost',
        fallbackUrl: 'https://www.youtube.com',
      },
      // social: {}
      // analytics: {
      //   campaign: userId,
      // },
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });

    return link;
  }

  const shareProfile = async () => {
    const profileURL = await buildProfileLink();

    console.log(profileURL);

    const shareOptions: ShareOptions = {
      title: userData?.displayName,
      message: `Visit this ${appName} profile - ${userData?.displayName}`,
      url: profileURL,
      subject: `View Profile`,
      failOnCancel: true,
      showAppsToView: true,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
    } catch (err) {
      console.log('INVITE ERROR', err);
    }
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

      <TouchableOpacity style={{marginTop: 50}} onPress={shareProfile}>
        <Text>Share the profile</Text>
      </TouchableOpacity>

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
              onPress={() => navigation.navigate('Chats')}
              className="border border-[#694242] p-2 w-[40%] rounded-md dark:border-[#9e6969]">
              <Text className="text-center text-[#694242] font-bold dark:text-[#9e6969]">
                See Your Chats
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

      <Overlay
        isVisible={messagesLoading}
        fullScreen={true}
        overlayStyle={{
          backgroundColor: 'transparent',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#9e6969" />
      </Overlay>

      <RNBottomSheet
        isVisible={showFriends}
        onBackdropPress={() => setShowFriends(false)}
        bottomSheetHeight={400}>
        {friends.length !== 0 ? (
          <>
            <SearchBar
              value={searchFriendsValue}
              onChangeText={text => setSearchFriendsValue(text)}
              onCancelPress={() => setSearchFriendsValue('')}
              style={{marginTop: 1}}
            />
            <ScrollView
              bounces
              contentContainerStyle={{paddingBottom: 10}}
              className="h-[310px] mt-2"
              showsVerticalScrollIndicator={false}>
              {(searchFriendsValue ? searchFriendsResult! : friends)?.map(
                (friend: Friend) => (
                  <FriendComponent
                    key={friend._id}
                    navigateToMessageScreen={navigateToMessageScreen}
                    navigateToUserProfile={navigateToUserProfile}
                    friend={friend}
                  />
                ),
              )}
            </ScrollView>
          </>
        ) : (
          renderEmptyFriendsListComponent()
        )}
      </RNBottomSheet>
    </ScrollView>
  );
};

export default UserProfileScreen;
