import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../components/Navigator';
import {Friend, Post} from '../../typings';
import PostComponent from '../components/PostComponent';
import {
  Menu,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import FriendComponent from '../components/FriendComponent';

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
];

const UserProfileScreen = () => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const {
    params: {userInfo},
  } = useRoute<UserScreenRouteProp>();
  const [friendButtonClick, setFriendButtonClick] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const yourAccount = true;
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

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 15}}
      className="bg-gray-300 relative dark:bg-[#151515]">
      <StatusBar barStyle="light-content" backgroundColor="#694242" />
      <Image
        className="h-20 w-20 absolute z-10 top-5 rounded-full ml-3"
        source={{uri: userInfo.user.userImage}}
      />

      <View className="h-16 bg-[#694242]">
        <Text className="mt-auto ml-[100px] text-white mb-1 font-bold text-lg">
          {userInfo.user.userName}
        </Text>
      </View>

      <Text className="ml-[100px] text-base text-gray-600 dark:text-gray-400">
        {userInfo.userPosts.length > 0 && userInfo.userPosts.length}
        {userInfo.userPosts.length === 0
          ? 'No Posts'
          : userInfo.userPosts.length === 1
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
        {userInfo.userPosts.map((post: Post) => (
          <PostComponent
            key={post.id}
            post={post}
            fromUserProfileScreen={true}
          />
        ))}
      </View>

      <Menu
        name="numbers"
        renderer={renderers.SlideInMenu}
        opened={showFriends}
        onBackdropPress={() => setShowFriends(false)}>
        <MenuTrigger />
        <MenuOptions
          customStyles={{
            optionsContainer: {
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              backgroundColor: scheme === 'dark' ? '#312F2F' : '#ececec',
            },
          }}>
          <ScrollView
            bounces
            className="h-[310px]"
            showsVerticalScrollIndicator={false}>
            <Text className="text-gray-500 text-xl mt-3 mx-auto dark:text-gray-400 font-bold">
              Total Friends - {friends?.length}
            </Text>
            {friends.map((friend: Friend) => (
              <FriendComponent key={friend.id} friend={friend} />
            ))}
          </ScrollView>
        </MenuOptions>
      </Menu>
    </ScrollView>
  );
};

export default UserProfileScreen;
