import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  Animated,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import ImageLinks from '../assets/images';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp} from '../screens/UserProfileScreen';
import Video from 'react-native-video';
import VisibilitySensor from '@svanboxel/visibility-sensor-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectMuteVideo, setMuteVideo} from '../slices/muteVideoSlice';
import {urlFor} from '../lib/client';
import likePostMutation from '../lib/likePostMutation';
import {selectUser} from '../slices/userSlice';
import TimeAgo from 'react-native-timeago';
import moment from 'moment';
import RNBottomSheet from './RNBottomSheet';
import Share, {ShareOptions} from 'react-native-share';
import {buildShareLink} from '../lib/buildShareLink';
import {postOptions} from '../lib/options';
import {POST_OPTIONS} from '../enums';
import PostOptionComponent from './PostOptionComponent';

type Props = {
  post: Post;
  fromUserProfileScreen?: boolean;
  displayDeleteModal: (postId: string) => void;
};

const PostComponent = ({
  post,
  fromUserProfileScreen,
  displayDeleteModal,
}: Props) => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const [showMore, setShowMore] = useState(false);
  const [showWholeContent, setShowWholeContent] = useState(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const scheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [pauseVideo, setPauseVideo] = useState(false);
  const muteVideo = useSelector(selectMuteVideo);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // const postLikes = post.likes;
  const [likes, setLikes] = useState<LikeUser[] | undefined>(post.likes);
  const [liked, setLiked] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (post.subTitle!.length > 200) {
        setShowMore(true);
      }

      setLikes(post.likes);

      if (checkUserLiked(post.likes)) {
        setLiked(true);
      } else {
        setLiked(false);
      }

      setTotalComments(post.postComments?.length!);
    }
  }, [isFocused, post, post.likes]);

  const checkUserLiked = (postLikes: LikeUser[] | undefined) => {
    const tempLikes = postLikes;
    let result = false;
    if (tempLikes && tempLikes?.length! > 0) {
      tempLikes?.map(postLike => {
        if (postLike?._ref === user.uid) {
          result = true;
        }
      });
    }

    return result;
  };

  const getUserLikedIndex = () => {
    let result = -1;
    if (likes && likes?.length! > 0) {
      likes?.map(postLike => {
        if (postLike?._ref === user.uid) {
          result = likes.indexOf(postLike);
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

  const navigateToUserProfile = async () => {
    if (!fromUserProfileScreen) {
      navigation.navigate('UserProfile', {
        userId: post.user._id!,
      });
    }
  };

  const navigateToCommentsScreen = () => {
    navigation.push('Comments', {
      postId: post._id!,
      postComments: post.postComments!,
    });
  };

  const handleLikePost = async () => {
    let tempLikes = likes || [];
    if (checkUserLiked(likes)) {
      tempLikes?.splice(getUserLikedIndex(), 1);
      setLiked(false);
    } else {
      const userLike: SanityLikeUser = {
        _type: 'reference',
        _ref: user.uid,
        _key: user.uid,
      };
      setLikes([...(likes || []), userLike]);
      tempLikes = [...tempLikes!, userLike];
      setLiked(true);
    }

    const res = await likePostMutation(tempLikes!, post._id!);
  };

  const navigateToLikesScreen = () => {
    navigation.navigate('Likes', {
      postId: post._id!,
      likesLength: likes?.length!,
    });
  };

  const handlePostOptionFunctions = (title: string) => {
    setModalVisible(false);

    switch (title) {
      case POST_OPTIONS.SHARE_POST:
        handleSharePost();
        break;
      case POST_OPTIONS.DELETE_POST:
        displayDeleteModal(post._id!);
        break;
    }
  };

  const handleSharePost = async () => {
    const postURL = await buildShareLink('post', post._id!);

    const shareOptions: ShareOptions = {
      title: post.title,
      message: 'Checkout this post from ChatPost App',
      url: postURL,
      subject: `View Post`,
      failOnCancel: true,
      showAppsToView: true,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
    } catch (err) {
      console.log('POST SHARE ERROR', err);
    }
  };

  return (
    <View className="rounded-md shadow-slate-900 shadow-2xl bg-[#ebedef] mt-4 last:mb-4 dark:bg-[#262626]">
      {/* UPPER PART */}
      <View className="flex flex-row items-center justify-between px-3 mt-3">
        <View className="flex flex-row items-center space-x-3">
          <TouchableOpacity activeOpacity={0.5} onPress={navigateToUserProfile}>
            <Image
              className="h-10 w-10 rounded-full"
              source={{uri: post.user.photoURL}}
            />
          </TouchableOpacity>
          <View className="max-w-[70%]">
            <Text
              onPress={navigateToUserProfile}
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
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            className="-mt-2 mb-5 max-h-72">
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
          </ScrollView>
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

      {(likes?.length! > 0 || totalComments > 0) && (
        <View className="flex flex-row items-center px-3 h-10">
          {likes?.length! > 0 && (
            <TouchableOpacity
              onPress={navigateToLikesScreen}
              className="flex flex-row items-center space-x-1">
              <View className="bg-[#aa6e6e] dark:bg-[#8b6060] p-1 rounded-full">
                <Image
                  className="h-3 w-3"
                  source={ImageLinks.like.likeSolidDarkMode}
                  style={{tintColor: 'whitesmoke'}}
                />
              </View>
              <Text className="text-gray-500 text-xs dark:text-gray-400 font-semibold">
                {likes?.length} {likes?.length! > 1 ? 'likes' : 'like'}
              </Text>
            </TouchableOpacity>
          )}

          {totalComments > 0 && (
            <TouchableOpacity
              onPress={navigateToCommentsScreen}
              className="flex flex-row ml-auto items-center space-x-1">
              {totalComments > 0 && (
                <Text className="text-gray-500 text-xs dark:text-gray-400 font-semibold">
                  {totalComments}
                </Text>
              )}
              <Text className="text-gray-500 text-xs dark:text-gray-400 font-semibold">
                {totalComments > 1 ? 'comments' : 'comment'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

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
            style={{
              tintColor:
                scheme === 'dark'
                  ? liked
                    ? '#D89A9A'
                    : 'gray'
                  : liked
                  ? '#8b6060'
                  : 'gray',
            }}
          />
          <Text
            className={`${
              liked
                ? 'text-[#aa6e6e] dark:text-[#D89A9A] font-bold'
                : 'text-gray-500 dark:text-gray-400 font-bold'
            } text-xs`}>
            Like
          </Text>
        </TouchableOpacity>

        {/* SEPARATOR */}
        <View className="w-[1px] h-full bg-gray-300 dark:bg-[#383838]" />

        {/* COMMENT */}
        <TouchableOpacity
          onPress={navigateToCommentsScreen}
          activeOpacity={0.5}
          className="flex flex-row items-center space-x-2 py-[10px]">
          <Image className="h-4 w-4" source={ImageLinks.commentsSolid} />
          <Text className="text-gray-500 text-xs dark:text-gray-400 font-semibold">
            Comment
          </Text>
        </TouchableOpacity>
      </View>

      <RNBottomSheet
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        bottomSheetHeight={100}>
        <View>
          {postOptions.map(postOption => {
            if (post.user._id !== user.uid) {
              if (postOption.title !== POST_OPTIONS.DELETE_POST) {
                return (
                  <PostOptionComponent
                    key={postOption.title}
                    postOption={postOption}
                    handlePostOptionFunctions={handlePostOptionFunctions}
                  />
                );
              }
            } else {
              return (
                <PostOptionComponent
                  key={postOption.title}
                  postOption={postOption}
                  handlePostOptionFunctions={handlePostOptionFunctions}
                />
              );
            }
          })}
        </View>
      </RNBottomSheet>
    </View>
  );
};

export default PostComponent;
