import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {LikeUser, Post} from '../types/typings';
import ImageLinks from '../assets/images';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp} from '../screens/UserProfileScreen';
import Video from 'react-native-video';
import VisibilitySensor from '@svanboxel/visibility-sensor-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectMuteVideo, setMuteVideo} from '../slices/muteVideoSlice';
import {urlFor} from '../lib/client';
import deletePost from '../lib/deletePost';
import likePostMutation from '../lib/likePostMutation';
import {selectUser} from '../slices/userSlice';
import TimeAgo from 'react-native-timeago';
import moment from 'moment';
import RNBottomSheet from './RNBottomSheet';
import {Overlay} from '@rneui/themed';

type Props = {
  post: Post;
  fromUserProfileScreen?: boolean;
};

const PostComponent = ({post, fromUserProfileScreen}: Props) => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const [showMore, setShowMore] = useState(false);
  const [showWholeContent, setShowWholeContent] = useState(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [showDeleteBox, setShowDeleteBox] = useState<boolean>(false);
  const scheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [pauseVideo, setPauseVideo] = useState(false);
  const muteVideo = useSelector(selectMuteVideo);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const postLikes = post.likes;
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (post.subTitle!.length > 200) {
        setShowMore(true);
      }

      if (checkUserLiked()) {
        setLiked(true);
      } else {
        setLiked(false);
      }

      setTotalLikes(post.likes?.length!);
      setTotalComments(post.postComments?.length!);
    }
  }, [isFocused, fromUserProfileScreen && post]);

  const checkUserLiked = () => {
    let result = false;
    if (postLikes?.length! > 0) {
      postLikes?.map(postLike => {
        if (postLike._ref === user.uid) {
          result = true;
        }
      });
    }

    return result;
  };

  const getUserLikedIndex = () => {
    let result = -1;
    if (postLikes?.length! > 0) {
      postLikes?.map(postLike => {
        if (postLike._ref === user.uid) {
          result = postLikes.indexOf(postLike);
        }
      });
    }

    return result;
  };

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
      // await fetchUserData(post.user._id!).then((resUserData: UserData) => {
      //   navigation.navigate('UserProfile', {
      //     userData: resUserData,
      //   });
      // });
      navigation.navigate('UserProfile', {
        userId: post.user._id!,
      });
    }
  };

  const handleLikePost = async () => {
    let tempLikes: LikeUser[] = postLikes || [];

    if (checkUserLiked()) {
      tempLikes.splice(getUserLikedIndex(), 1);
      setLiked(false);
    } else {
      const userLike: SanityLikeUser = {
        _type: 'reference',
        _ref: user.uid,
        _key: user.uid,
      };
      tempLikes = [...tempLikes, userLike];
      setLiked(true);
    }

    setTotalLikes(tempLikes.length);

    const res = await likePostMutation(tempLikes, post._id!);
  };

  const handleDeletePost = async () => {
    setModalVisible(false);
    await deletePost(post._id!);
  };

  return (
    <View className="rounded-lg shadow-slate-900 shadow-2xl bg-[#ebedef] mx-4 mt-4 last:mb-4 dark:bg-[#262626]">
      {/* UPPER PART */}
      <View className="flex flex-row items-center justify-between px-3 mt-3">
        <View className="flex flex-row items-center space-x-3">
          <TouchableOpacity activeOpacity={0.5} onPress={getUserData}>
            <Image
              className="h-10 w-10 rounded-full"
              source={{uri: post.user.photoURL}}
            />
          </TouchableOpacity>
          <View className="max-w-[70%]">
            <Text
              onPress={getUserData}
              className="text-gray-700 text-base font-bold w-full dark:text-gray-200">
              {post.user.displayName}
            </Text>
            <Text className="text-gray-500 text-[12px] dark:text-gray-400">
              {/* SHOW TIME AGO IF POST IS NOT OLDER THAN 1 MONTH ELSE SHOW DATE OF CREATION OF POST */}
              {Math.ceil(
                Math.abs(
                  new Date(post._createdAt!).getTime() - new Date().getTime(),
                ) /
                  (1000 * 60 * 60 * 24),
              ) < 30 ? (
                <TimeAgo time={post._createdAt!} />
              ) : (
                moment(post._createdAt).format('LL')
              )}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            className="h-5 w-5"
            source={ImageLinks.dotsVertical}
            style={{tintColor: scheme === 'dark' ? '#a7a7a7' : 'gray'}}
          />
        </TouchableOpacity>
      </View>

      {/* MIDDLE PART */}
      <View className="px-3 mt-3">
        <Text className="text-gray-600 text-lg font-bold dark:text-gray-300 mb-4">
          {post.title}
        </Text>
        {post.subTitle && (
          <View className="-mt-4 mb-5">
            <Text className="text-gray-500 text-sm dark:text-gray-400">
              {showWholeContent
                ? post.subTitle
                : showMore
                ? post.subTitle?.slice(0, 200) + '...'
                : post.subTitle?.slice(0, 200)}
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
        )}
      </View>

      {/* IMAGE PART */}
      {post.imageUrl && (
        <Image
          resizeMode="contain"
          className="mx-auto aspect-square"
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
          onPress={handleLikePost}
          className="flex flex-row items-center space-x-2 py-[10px]">
          <Image
            className="h-4 w-4"
            source={
              scheme === 'dark'
                ? liked
                  ? ImageLinks.like.likeSolidDarkMode
                  : ImageLinks.like.likeOutline
                : liked
                ? ImageLinks.like.likeSolidLightMode
                : ImageLinks.like.likeOutline
            }
          />
          {totalLikes > 0 && (
            <Text
              className={`${
                liked
                  ? 'text-[#694242] dark:text-[#D89A9A] font-bold'
                  : 'text-gray-500 dark:text-gray-400 font-bold'
              } text-xs`}>
              {totalLikes}
            </Text>
          )}
          <Text
            className={`${
              liked
                ? 'text-[#694242] dark:text-[#D89A9A] font-bold'
                : 'text-gray-500 dark:text-gray-400 font-bold'
            } text-xs`}>
            {totalLikes > 1 ? 'Likes' : 'Like'}
          </Text>
        </TouchableOpacity>

        {/* SEPARATOR */}
        <View className="w-[1px] h-full bg-gray-300 dark:bg-[#383838]" />

        {/* COMMENT */}
        <TouchableOpacity
          onPress={() =>
            navigation.push('Comments', {
              postId: post._id!,
              postComments: post.postComments!,
            })
          }
          activeOpacity={0.5}
          className="flex flex-row items-center space-x-2 py-[10px]">
          <Image className="h-4 w-4" source={ImageLinks.commentsSolid} />
          {totalComments > 0 && (
            <Text className="text-gray-500 text-xs dark:text-gray-400 font-semibold">
              {totalComments}
            </Text>
          )}
          <Text className="text-gray-500 text-xs dark:text-gray-400 font-semibold">
            {totalComments > 1 ? 'Comments' : 'Comment'}
          </Text>
        </TouchableOpacity>
      </View>

      <Overlay
        overlayStyle={{
          backgroundColor: scheme === 'dark' ? '#262626' : '#ebedef',
          paddingHorizontal: 30,
          paddingVertical: 20,
          width: 300,
          borderRadius: 10,
        }}
        onBackdropPress={() => setShowDeleteBox(false)}
        isVisible={showDeleteBox}
        animationType="fade">
        <Text className="text-gray-500 dark:text-gray-400 font-semibold text-lg mb-4">
          Post will be permanently deleted.
        </Text>
        <Text className="text-gray-500 text-base dark:text-gray-400 mb-4">
          Are you sure you want to delete it?
        </Text>
        <View className="flex flex-row justify-evenly space-x-4 items-center">
          <TouchableOpacity
            className="bg-[#FF5959] w-24 items-center rounded-lg px-3 py-2"
            onPress={handleDeletePost}>
            <Text className="text-white">Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border border-[#FF5959] w-24 items-center rounded-lg px-3 py-2"
            onPress={() => setShowDeleteBox(false)}>
            <Text className="text-[#FF5959]">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Overlay>

      <RNBottomSheet
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        bottomSheetHeight={100}>
        <View>
          {post.user._id === user.uid && (
            <TouchableOpacity
              className="flex flex-row items-center mr-auto space-x-2 px-4 py-2"
              onPress={() => {
                setModalVisible(false);
                setShowDeleteBox(true);
              }}>
              <Image
                className="h-6 w-6 mt-1"
                style={{tintColor: '#FF5959'}}
                source={ImageLinks.deleteIcon}
              />
              <Text className="text-[#FF5959] text-lg">Delete Post</Text>
            </TouchableOpacity>
          )}
        </View>
      </RNBottomSheet>
    </View>
  );
};

export default PostComponent;
