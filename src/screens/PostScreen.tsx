import {
  View,
  Text,
  StatusBar,
  useColorScheme,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {RootStackParamList} from '../navigator/RootNavigator';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ImageLinks from '../assets/images';
import CommentInput from '../components/CommentInput';
import {deleteComment, sendComment} from '../lib/commentFunctions';
import {selectUser} from '../slices/userSlice';
import {useSelector} from 'react-redux';
import {client, urlFor} from '../lib/client';
import CommentComponent from '../components/CommentComponent';
import {checkUserLiked, handleLikePost} from '../lib/likeFunctions';
import getPost from '../lib/getPost';
import TimeAgo from 'react-native-timeago';
import moment from 'moment';
import LoaderComponent from '../components/LoaderComponent';
import ShareButton from '../components/ShareButton';
import {buildShareLink} from '../lib/buildShareLink';
import Share, {ShareOptions} from 'react-native-share';

export type PostScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Post'
>;

type PostScreenRouteProp = RouteProp<RootStackParamList, 'Post'>;

const PostScreen = () => {
  const scheme = useColorScheme();

  const navigation = useNavigation<PostScreenNavigationProp>();
  const {
    params: {postId},
  } = useRoute<PostScreenRouteProp>();
  // const postId = 'Fgjio7hQJRSwPAG3HKqtSM';

  const [showWholeContent, setShowWholeContent] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<PostComment[]>([]);
  const isFocused = useIsFocused();
  const user = useSelector(selectUser);
  const [likes, setLikes] = useState<LikeUser[] | undefined>([]);
  const [liked, setLiked] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [post, setPost] = useState<Post>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const fetchPostData = async () => {
    const res = await getPost(client, postId);
    setPost(res);
  };

  useEffect(() => {
    // @ts-ignore
    setComments(post?.postComments);
  }, [post]);

  useEffect(() => {
    if (comments) setTotalComments(comments.length);
  }, [comments]);

  useEffect(() => {
    if (isFocused) fetchPostData();
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && post) {
      if (post.subTitle?.length! > 200) {
        setShowMore(true);
      }

      setLikes(post.likes);

      if (checkUserLiked(post.likes, user.uid)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }
  }, [isFocused, post, post?.likes]);

  useEffect(() => {
    if (isFocused && post?.subTitle) {
      if (post.subTitle.length > 200) {
        setShowMore(true);
      }
    }
  }, [isFocused]);

  const handleComment = async () => {
    await sendComment(
      comment,
      comments,
      user.uid,
      postId,
      setComment,
      setComments,
    );
  };

  const navigateToUserProfile = async () => {
    navigation.navigate('UserProfile', {
      userId: post?.user?._id!,
    });
  };

  const navigateToLikesScreen = () => {
    navigation.navigate('Likes', {
      postId: postId,
      likesLength: likes?.length!,
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId, comments, setComments, postId, client);
  };

  const likePost = async () => {
    handleLikePost(likes, setLiked, setLikes, user.uid, postId);
  };

  const handleSharePost = async () => {
    const postURL = await buildShareLink('post', postId);

    const shareOptions: ShareOptions = {
      title: post?.title,
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

  if (!post) return <LoaderComponent />;

  return (
    <View className="bg-white flex-1 dark:bg-[#151515]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={scheme === 'dark' ? '#151515' : 'white'}
        />

        {/* UPPER PART */}
        <View className="flex flex-row items-center justify-between px-3 mt-3">
          {/* LEFT */}
          <View className="flex flex-row items-center space-x-3">
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={navigateToUserProfile}>
              <Image
                source={{uri: post?.user?.photoURL}}
                className="h-10 w-10 rounded-full"
              />
            </TouchableOpacity>

            <View className="max-w-[70%]">
              <Text
                onPress={navigateToUserProfile}
                className="text-gray-700 text-base font-bold w-full dark:text-gray-200">
                {post?.user?.displayName}
              </Text>
              <Text className="text-gray-500 text-[12px] dark:text-gray-400">
                {/* SHOW TIME AGO IF POST IS NOT OLDER THAN 1 MONTH ELSE SHOW DATE OF CREATION OF POST */}
                {Math.ceil(
                  Math.abs(
                    new Date(post?._createdAt!).getTime() -
                      new Date().getTime(),
                  ) /
                    (1000 * 60 * 60 * 24),
                ) < 30 ? (
                  <TimeAgo time={post?._createdAt!} />
                ) : (
                  moment(post?._createdAt).format('LL')
                )}
              </Text>
            </View>
          </View>

          {/* RIGHT */}
          <View>
            <ShareButton onPress={handleSharePost} />
          </View>
        </View>

        {/* MIDDLE PART */}
        <View className="px-3 mt-5">
          <Text className="text-gray-600 text-lg font-bold dark:text-gray-300 mb-4">
            {post?.title}
          </Text>
          {post?.subTitle && (
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              className="-mt-3 mb-5 max-h-72">
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
        {post?.imageUrl && (
          <Image
            resizeMode="contain"
            className="mx-auto aspect-square"
            source={{uri: urlFor(post.imageUrl).url()}}
          />
        )}

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
                onPress={() => {}}
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
        <View className="flex flex-row justify-evenly items-center border-t border-b border-gray-300 dark:border-[#282828]">
          {/* LIKE */}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={likePost}
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
          <View className="w-[1px] h-full bg-gray-300 dark:bg-[#282828]" />

          {/* COMMENT */}
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.5}
            className="flex flex-row items-center space-x-2 py-[10px]">
            <Image className="h-4 w-4" source={ImageLinks.commentsSolid} />
            <Text className="text-gray-500 text-xs dark:text-gray-400 font-semibold">
              Comment
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comments on Post */}
        <View className="px-3 mt-3">
          <Text className="text-gray-600 text-lg font-bold dark:text-gray-300 mb-4">
            {comments?.length > 0 ? 'Comments' : 'No Comments Yet'}
          </Text>

          {/* Comments */}
          <ScrollView contentContainerStyle={{paddingBottom: 15}}>
            {comments?.map(cmnt => (
              <CommentComponent
                key={cmnt._id}
                comment={cmnt}
                deleteComment={handleDeleteComment}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Comment Input */}
      <CommentInput
        comment={comment}
        onChangeComment={(text: string) => setComment(text)}
        handleComment={handleComment}
        userPhoto={user.photoURL}
      />
    </View>
  );
};

export default PostScreen;
