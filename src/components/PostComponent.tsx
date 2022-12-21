import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Post, UserInfo} from '../../typings';
import ImageLinks from '../assets/images';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp} from '../screens/UserProfileScreen';

type Props = {
  post: Post;
  fromUserProfileScreen?: boolean;
};

const userInfo: UserInfo = {
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

const PostComponent = ({post, fromUserProfileScreen}: Props) => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const [showMore, setShowMore] = useState(false);
  const [showWholeContent, setShowWholeContent] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const scheme = useColorScheme();

  useEffect(() => {
    if (post.subTitle.length > 200) {
      setShowMore(true);
    }
  }, []);

  // homescreen-bg-gray-300 bg-[#E9E9E9]

  return (
    <View className="rounded-lg shadow-slate-900 shadow-2xl bg-[#E9E9E9] mx-4 mt-4 last:mb-4 dark:bg-[#262626]">
      {/* UPPER PART */}
      <View className="flex flex-row items-center space-x-3 px-3 mt-3">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if (!fromUserProfileScreen)
              navigation.navigate('UserProfile', {
                userInfo: userInfo,
              });
          }}>
          <Image
            className="h-10 w-10 rounded-full"
            source={{uri: post.userImage}}
          />
        </TouchableOpacity>
        <View className="w-[70%]">
          <Text
            onPress={() => {
              if (!fromUserProfileScreen)
                navigation.navigate('UserProfile', {
                  userInfo: userInfo,
                });
            }}
            className="text-gray-700 text-base font-bold w-full dark:text-gray-200">
            {post.userName}
          </Text>
          <Text className="text-gray-500 text-[12px] dark:text-gray-400">
            {new Date(post.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* MIDDLE PART */}
      <View className="px-3 mt-3 mb-5">
        <Text className="text-gray-600 text-lg font-bold dark:text-gray-300">
          {post.title}
        </Text>
        <Text className="text-gray-500 text-sm dark:text-gray-400">
          {showWholeContent
            ? post.subTitle
            : post.subTitle.slice(0, 200) + '...'}
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setShowWholeContent(!showWholeContent)}>
          {showMore && (
            <Text className="underline text-gray-500 font-bold dark:text-gray-400">
              {!showWholeContent ? 'Show More' : 'Show Less'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* IMAGE PART */}
      {post.imageUrl && (
        <Image
          resizeMode="stretch"
          className="h-60"
          source={{uri: post.imageUrl}}
        />
      )}

      {/* BOTTOM PART */}
      <View className="flex flex-row justify-evenly items-center border-t border-gray-400 dark:border-gray-600">
        {/* LIKE */}
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setLikeClicked(!likeClicked)}
          className="flex flex-row items-center space-x-2 py-3">
          <Image
            source={
              scheme === 'dark'
                ? likeClicked
                  ? ImageLinks.like.likeSolidDarkMode
                  : ImageLinks.like.likeOutline
                : likeClicked
                ? ImageLinks.like.likeSolidLightMode
                : ImageLinks.like.likeOutline
            }
          />
          <Text
            className={`${
              likeClicked
                ? 'text-[#694242] dark:text-[#D89A9A] font-bold'
                : 'text-gray-500 dark:text-gray-400 font-bold'
            }`}>
            Like
          </Text>
        </TouchableOpacity>

        {/* SEPARATOR */}
        <View className="w-[1px] h-full bg-gray-400 dark:bg-gray-600" />

        {/* COMMENT */}
        <TouchableOpacity
          activeOpacity={0.5}
          className="flex flex-row items-center space-x-2 py-3">
          <Image source={ImageLinks.commentsSolid} />
          <Text className="text-gray-500 dark:text-gray-400 font-semibold">
            Comments
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostComponent;
