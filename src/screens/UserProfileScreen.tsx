import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {Friend, Post} from '../types/typings';
import PostComponent from '../components/PostComponent';
import FriendComponent from '../components/FriendComponent';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import useFetchUserDataListener from '../hooks/useFetchUserDataListener';
import {client} from '../lib/client';
import RNBottomSheet from '../components/RNBottomSheet';

export type UserScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UserProfile'
>;

type UserScreenRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

const friends: Friend[] = [
  {
    id: '1',
    userName: 'Iron Man',
    userImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
  },
  {
    id: '2',
    userName: 'Iron Man',
    userImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
  },
  {
    id: '3',
    userName: 'Iron Man',
    userImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
  },
  {
    id: '4',
    userName: 'Iron Man',
    userImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
  },
  {
    id: '5',
    userName: 'Iron Man',
    userImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
  },
  {
    id: '6',
    userName: 'Iron Man',
    userImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
  },
  {
    id: '7',
    userName: 'Iron Man',
    userImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
  },
  {
    id: '8',
    userName: 'Iron Man',
    userImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
  },
];

const UserProfileScreen = () => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const {
    params: {userId},
  } = useRoute<UserScreenRouteProp>();
  const {userData} = useFetchUserDataListener(client, userId);
  const [friendButtonClick, setFriendButtonClick] = useState(false);
  const user = useSelector(selectUser);
  const [showFriends, setShowFriends] = useState(false);
  const yourAccount = userId === user.uid;
  const scheme = useColorScheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      //   title: userInfo?.user.userName,
      headerShown: false,
    });
  }, []);

  const addFriend = () => {
    setFriendButtonClick(!friendButtonClick);
  };

  if (!userData)
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
              onPress={addFriend}
              className="bg-[#694242] border p-2 w-[40%] rounded-md">
              <Text className="text-center font-bold text-white">
                {!friendButtonClick ? 'Add Friend' : 'Unfriend'}
              </Text>
            </TouchableOpacity>
            {friendButtonClick && (
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
        <ScrollView
          bounces
          contentContainerStyle={{paddingBottom: 10}}
          className="h-[310px]"
          showsVerticalScrollIndicator={false}>
          {friends.map((friend: Friend) => (
            <FriendComponent key={friend.id} friend={friend} />
          ))}
        </ScrollView>
      </RNBottomSheet>
    </ScrollView>
  );
};

export default UserProfileScreen;
