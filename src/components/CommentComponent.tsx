import {View, Text, TouchableOpacity, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import {Button} from '@rneui/themed';
import CommentAndReplyView from './CommentAndReplyView';
import {useDispatch} from 'react-redux';
import {setFocusCommentInput} from '../slices/focusCommentInputSlice';

type Props = {
  comment: any;
  deleteComment: (commentId: string) => void;
};

const CommentComponent = ({comment, deleteComment}: Props) => {
  const [showReplies, setShowReplies] = useState(false);
  const scheme = useColorScheme();
  const dispatch = useDispatch();

  const handleReply = () => {
    dispatch(
      setFocusCommentInput({
        focusComment: true,
        commentUserName: comment.user.displayName,
      }),
    );
  };

  return (
    <View className="flex mb-4">
      <CommentAndReplyView comment={comment} deleteComment={deleteComment} />

      <View className="flex flex-row space-x-4 ml-auto mr-12">
        <TouchableOpacity
          className="flex text-gray-700 w-12"
          activeOpacity={0.5}
          onPress={handleReply}>
          <Text className="text-gray-600 dark:text-gray-300">Reply</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex text-gray-700 w-24"
          activeOpacity={0.5}
          onPress={() => setShowReplies(!showReplies)}>
          <Text className="text-gray-600 dark:text-gray-300">
            {showReplies ? 'Hide Replies' : 'Show Replies'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <Button
        buttonStyle={{
          backgroundColor: 'transparent',
          marginLeft: 'auto',
          marginRight: 45,
          width: 150,
        }}
        titleStyle={{color: scheme === 'dark' ? 'lightgray' : 'gray'}}
        onPress={() => setShowReplies(!showReplies)}
        title={showReplies ? 'Hide Replies' : 'Show Replies'}
      /> */}

      {/* #TODO: Replies Will Go Here */}
      {showReplies && (
        <>
          <CommentAndReplyView
            comment={comment}
            deleteComment={deleteComment}
            isReply
          />
          <CommentAndReplyView
            comment={comment}
            deleteComment={deleteComment}
            isReply
          />
          <CommentAndReplyView
            comment={comment}
            deleteComment={deleteComment}
            isReply
          />
          <CommentAndReplyView
            comment={comment}
            deleteComment={deleteComment}
            isReply
          />
          <CommentAndReplyView
            comment={comment}
            deleteComment={deleteComment}
            isReply
          />
        </>
      )}
    </View>
  );
};

export default CommentComponent;
