import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import TimeAgo from 'react-native-timeago';

type Props = {
  comment: any;
};

const CommentComponent = ({comment}: Props) => {
  const [showWholeComment, setShowWholeComment] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (comment.comment.length > 100) {
      setShowMore(true);
    }
  }, []);

  return (
    <View className="flex flex-row space-x-2 p-3">
      <TouchableOpacity activeOpacity={0.5}>
        <Image
          source={{
            uri: comment?.user.photoURL,
          }}
          className="h-8 w-8 rounded-full mt-1"
        />
      </TouchableOpacity>

      <View className="py-2 px-3 bg-[#F0F2F5] dark:bg-[#2c2d2e] rounded-2xl">
        <View className="flex flex-row items-center space-x-3">
          <Text className="font-bold text-[15px] text-gray-700 dark:text-gray-200">
            {comment?.user.displayName}
          </Text>

          <Text className="text-gray-500 dark:text-gray-400">
            <TimeAgo time={comment._createdAt!} hideAgo={true} />
          </Text>
        </View>

        <Text className="w-72 text-gray-700 dark:text-gray-300">
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
    </View>
  );
};

export default CommentComponent;
