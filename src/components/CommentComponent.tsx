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
};

const CommentComponent = ({comment, deleteComment}: Props) => {
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
    navigation.navigate('UserProfile', {
      userId: comment.user._id || user.uid,
    });
  };

  return (
    <View className="flex flex-row space-x-2 p-3">
      <TouchableOpacity activeOpacity={0.5} onPress={navigateToUserProfile}>
        <Image
          source={{
            uri: comment?.user.photoURL || user.photoURL,
          }}
          className="h-8 w-8 rounded-full mt-1"
        />
      </TouchableOpacity>

      <View className="flex flex-1 py-2 px-3 bg-[#F0F2F5] dark:bg-[#2c2d2e] rounded-2xl">
        <View className="flex flex-row items-center space-x-3">
          <Text className="font-bold text-[15px] text-gray-700 dark:text-gray-200">
            {comment?.user.displayName || user.displayName}
          </Text>

          <Text className="text-gray-500 dark:text-gray-400">
            <TimeAgo time={comment._createdAt! || new Date()} hideAgo={true} />
          </Text>
        </View>

        <Text className="w-[90%] text-gray-700 dark:text-gray-300">
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

export default CommentComponent;
