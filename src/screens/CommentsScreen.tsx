import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigator/RootNavigator';
import CommentComponent from '../components/CommentComponent';
import {client} from '../lib/client';
import {PostComment} from '../types/typings';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import storePostComment from '../lib/storePostComment';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import useFetchPostComments from '../hooks/useFetchPostComments';

type CommentsScreenRouteProp = RouteProp<RootStackParamList, 'Comments'>;

const CommentsScreen = () => {
  const [comment, setComment] = useState('');
  const {
    params: {postId, postComments},
  } = useRoute<CommentsScreenRouteProp>();
  const user = useSelector(selectUser);
  const {comments} = useFetchPostComments(client, postId);

  const sendComment = async () => {
    if (!comment) return;

    const commentObj: PostComment = {
      _id: uuidv4(),
      _key: uuidv4(),
      _type: 'comments',
      comment: comment,
      user: {
        _ref: user.uid,
        _type: 'reference',
      },
      post: {
        _ref: postId,
        _type: 'reference',
      },
    };

    let commentForPost: StoreComment = {
      _key: commentObj._key,
      _ref: commentObj._id!,
      _type: 'reference',
    };

    let tempComments: StoreComment[] = postComments
      ? [...postComments, commentForPost]
      : [commentForPost];

    setComment('');
    await storePostComment(commentObj, tempComments, postId);
  };

  const renderCommentInput = () => (
    <View className="flex flex-row mt-auto p-2 bg-transparent items-center space-x-1">
      <TextInput
        value={comment}
        onChangeText={text => setComment(text)}
        className="flex-1 text-[16px] bg-[#F0F2F5] text-gray-700 max-h-20 rounded-lg p-3 dark:bg-[#3A3B3C] dark:text-gray-300"
        placeholder="Enter comment here...."
        placeholderTextColor="gray"
        multiline
        textAlignVertical="center"
      />
      <TouchableOpacity onPress={sendComment} activeOpacity={0.5}>
        <Text className="text-[#9e6969] text-lg">Send</Text>
      </TouchableOpacity>
    </View>
  );

  const renderComment = ({item}: any) => (
    <CommentComponent key={item._id} comment={item} />
  );

  const renderEmptyComments = () => {
    return (
      <View className="bg-white h-screen flex-1 justify-center items-center dark:bg-[#151515]">
        <ActivityIndicator size="large" color="#9e6969" />
      </View>
    );
  };

  if (comments.length === 0 && postComments?.length === 0) {
    return (
      <View className="bg-white flex-1 dark:bg-[#151515]">
        <View className="flex-1 items-center justify-center">
          <Text className="font-bold text-gray-600 dark:text-gray-200 text-xl text-center">
            No Comments yet on this post.
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-200 text-center mt-2">
            Be the first one to comment.
          </Text>
        </View>
        {renderCommentInput()}
      </View>
    );
  }

  // if (!postComments.length)
  //   return (
  //     <ActivityIndicator
  //       className="min-h-full bg-white relative dark:bg-[#151515]"
  //       size="large"
  //       color="#9e6969"
  //     />
  //   );

  return (
    <View className="bg-white flex-1 dark:bg-[#151515]">
      <FlatList
        data={comments}
        renderItem={renderComment}
        ListEmptyComponent={renderEmptyComments}
        // @ts-ignore
        keyExtractor={item => item._id}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: 15}}
      />

      {comments.length > 0 && renderCommentInput()}
    </View>
  );
};

export default CommentsScreen;
