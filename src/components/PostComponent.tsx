import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {Post, User, UserData} from '../types/typings';
import ImageLinks from '../assets/images';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp} from '../screens/UserProfileScreen';
import Video from 'react-native-video';
import VisibilitySensor from '@svanboxel/visibility-sensor-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectMuteVideo, setMuteVideo} from '../slices/muteVideoSlice';
import {urlFor} from '../lib/client';
import fetchUserData from '../lib/fetchUserData';

type Props = {
  post: Post;
  fromUserProfileScreen?: boolean;
};

const PostComponent = ({post, fromUserProfileScreen}: Props) => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const [showMore, setShowMore] = useState(false);
  const [showWholeContent, setShowWholeContent] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const scheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [pauseVideo, setPauseVideo] = useState(false);
  const muteVideo = useSelector(selectMuteVideo);
  const dispatch = useDispatch();

  useEffect(() => {
    // fetchUserData();

    if (post.subTitle!.length > 200) {
      setShowMore(true);
    }
  }, []);

  // homescreen-bg-gray-300 bg-[#E9E9E9]

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 0 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 1.1 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1100,
      useNativeDriver: true,
    }).start();
  };

  // const playPauseVideoFunction = () => {
  //   if (post.videoUrl) {
  //     setPauseVideo(!pauseVideo);
  //     if (pauseVideo) fadeOut();
  //     else fadeIn();
  //   }
  // };

  // const handleImageVisibility = (visible: any) => {
  //   // handle visibility change
  //   if (visible) setPauseVideo(false);
  //   else setPauseVideo(true);
  // };

  const getUserData = async () => {
    if (!fromUserProfileScreen) {
      await fetchUserData(post.user._id!).then((resUserData: UserData) => {
        navigation.navigate('UserProfile', {
          userData: resUserData,
        });
      });
    }
  };

  return (
    <View className="rounded-lg shadow-slate-900 shadow-2xl bg-[#E9E9E9] mx-4 mt-4 last:mb-4 dark:bg-[#262626]">
      {/* UPPER PART */}
      <View className="flex flex-row items-center space-x-3 px-3 mt-3">
        <TouchableOpacity activeOpacity={0.5} onPress={getUserData}>
          <Image
            className="h-10 w-10 rounded-full"
            source={{uri: post.user.photoURL}}
          />
        </TouchableOpacity>
        <View className="w-[70%]">
          <Text
            onPress={getUserData}
            className="text-gray-700 text-base font-bold w-full dark:text-gray-200">
            {post.user.displayName}
          </Text>
          <Text className="text-gray-500 text-[12px] dark:text-gray-400">
            {new Date(post._createdAt!).toLocaleString()}
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
            : post.subTitle?.slice(0, 200) + '...'}
        </Text>
        {post.subTitle && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setShowWholeContent(!showWholeContent)}>
            {showMore && (
              <Text className="underline text-gray-500 font-bold dark:text-gray-400">
                {!showWholeContent ? 'Show More' : 'Show Less'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* IMAGE PART */}
      {post.imageUrl && (
        <Image
          resizeMode="stretch"
          className="h-60"
          source={{uri: urlFor(post.imageUrl).url()}}
        />
      )}

      {/* {post.videoUrl && (
        <TouchableOpacity onPress={playPauseVideoFunction} activeOpacity={1}>
          <Animated.View
            style={{opacity: fadeAnim}}
            className={`bg-[#353535]/80 p-3 bottom-5 left-5 rounded-full absolute z-10`}>
            {pauseVideo ? (
              <Image
                style={{height: 30, width: 30}}
                source={ImageLinks.playIcon}
              />
            ) : (
              <Image
                style={{height: 30, width: 30}}
                source={ImageLinks.pauseIcon}
              />
            )}
          </Animated.View>

          <TouchableOpacity
            onPress={() => dispatch(setMuteVideo(!muteVideo))}
            activeOpacity={0.3}
            className="bg-[#353535]/80 p-[5px] right-5 bottom-5 rounded-full absolute z-10">
            {muteVideo ? (
              <Image
                style={{height: 18, width: 18}}
                source={ImageLinks.volume.volumeMute}
              />
            ) : (
              <Image
                style={{height: 18, width: 18}}
                source={ImageLinks.volume.volumeUp}
              />
            )}
          </TouchableOpacity>
          <VisibilitySensor
            key={post.id}
            onChange={isVisible => handleImageVisibility(isVisible)}>
            <View>
              <Video
                source={{uri: post.videoUrl}}
                resizeMode="stretch"
                className="relative h-60"
                muted={muteVideo}
                paused={pauseVideo}
                repeat
              />
            </View>
          </VisibilitySensor>
        </TouchableOpacity>
      )} */}

      {/* BOTTOM PART */}
      <View className="flex flex-row justify-evenly items-center border-t border-gray-300 dark:border-[#383838]">
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
        <View className="w-[1px] h-full bg-gray-300 dark:bg-[#383838]" />

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
