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
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {Friend, Post} from '../types/typings';
import PostComponent from '../components/PostComponent';
import {
  Menu,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import FriendComponent from '../components/FriendComponent';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';

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

const infoUser = {
  user: {
    userImage:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
    userName: 'Black Panther',
  },
  userPosts: [
    {
      id: '1',
      title: 'This is DEMO POST',
      subTitle:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      imageUrl:
        'https://cdn.vox-cdn.com/thumbor/IDuU1a0FYBrTb_X0tt5gCyTeALU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/10164247/BlackPanther596d2f04d1540_2040.jpg',
      timestamp: Date.now(),
      userImage:
        'https://cdn.vox-cdn.com/thumbor/IDuU1a0FYBrTb_X0tt5gCyTeALU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/10164247/BlackPanther596d2f04d1540_2040.jpg',
      userName: 'Black Panther',
    },
    {
      id: '2',
      title: 'This is DEMO POST',
      subTitle:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      timestamp: Date.now(),
      userImage:
        'https://cdn.vox-cdn.com/thumbor/IDuU1a0FYBrTb_X0tt5gCyTeALU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/10164247/BlackPanther596d2f04d1540_2040.jpg',
      userName: 'Black Panther',
    },
  ],
};

const UserProfileScreen = () => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const {
    params: {userData},
  } = useRoute<UserScreenRouteProp>();
  const [friendButtonClick, setFriendButtonClick] = useState(false);
  const user = useSelector(selectUser);
  const [showFriends, setShowFriends] = useState(false);
  const yourAccount = userData?._id === user.uid;
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
          : infoUser?.userPosts.length === 1
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
