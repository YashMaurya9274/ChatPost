import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import TimeAgo from 'react-native-timeago';
import {selectUser} from '../slices/userSlice';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp} from '../screens/UserProfileScreen';
import ImageLinks from '../assets/images';

type Props = {
  comment: any;
  deleteComment: (commentId: string) => void;
  isReply?: boolean;
};
const CommentAndReplyView = ({comment, deleteComment, isReply}: Props) => {
  const [showWholeComment, setShowWholeComment] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const user = useSelector(selectUser);
  const navigation = useNavigation<UserScreenNavigationProp>();

  useEffect(() => {
    if (comment.comment.length > 100) {
      setShowMore(true);
    }
  }, []);

  const navigateToUserProfile = () => {
    navigation.push('UserProfile', {
      userId: comment.user._id || user.uid,
    });
  };
  return (
    <View
      className={`flex relative flex-row space-x-2 p-3  ${isReply && 'ml-14'}`}>
      {/* {isReply && (
        <View className="absolute z-0 h-[100px] -left-[30px] -top-[20px] bg-gray-300 border border-gray-300 dark:bg-[#2c2d2e] dark:border-[#2c2d2e]" />
      )} */}

      {/* {isReply && (
        <View className="absolute z-0 w-10 -left-[38px] top-7 bg-gray-300 border border-gray-300 dark:bg-[#2c2d2e] dark:border-[#2c2d2e]" />
      )} */}

      <TouchableOpacity
        className="z-20 mt-1 rounded-full"
        activeOpacity={0.5}
        onPress={navigateToUserProfile}>
        <Image
          source={{
            uri: comment?.user.photoURL || user.photoURL,
          }}
          className={`${isReply ? 'h-7 w-7' : 'h-8 w-8'} rounded-full`}
        />
      </TouchableOpacity>

      <View className="flex flex-1 pt-2 pb-3 px-3 bg-[#F0F2F5] dark:bg-[#2c2d2e] rounded-2xl">
        <View className="flex flex-row items-center space-x-3 mb-1">
          <Text
            className={`font-bold ${
              isReply ? 'text-[14px]' : 'text-[15px]'
            } text-gray-700 dark:text-gray-200`}>
            {comment?.user.displayName || user.displayName}
          </Text>

          <Text className="text-gray-500 dark:text-gray-400">
            <TimeAgo time={comment._createdAt! || new Date()} hideAgo={true} />
          </Text>
        </View>

        <Text className="text-gray-700 dark:text-gray-300">
          {showWholeComment
            ? comment.comment
            : showMore
            ? comment.comment.slice(0, 100) + '...'
            : comment.comment.slice(0, 100)}
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setShowWholeComment(!showWholeComment)}>
          {showMore && (
            <Text className="text-xs underline text-gray-500 font-bold dark:text-gray-300">
              {!showWholeComment ? 'Show More' : 'Show Less'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {(comment.user._id === user.uid || !comment.user._id) && (
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => deleteComment(comment._id)}>
          <Image
            className="h-5 w-5 mt-1"
            style={{tintColor: '#FF5959'}}
            source={ImageLinks.deleteIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommentAndReplyView;
