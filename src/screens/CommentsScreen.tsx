import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigator/RootNavigator';
import CommentComponent from '../components/CommentComponent';
import {client} from '../lib/client';
import {PostComment} from '../types/typings';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import storePostComment from '../lib/storePostComment';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import getPostComments from '../lib/getPostComments';
import deletePostComment from '../lib/deletePostComment';
import {COLOR_CODE} from '../enums';

type CommentsScreenRouteProp = RouteProp<RootStackParamList, 'Comments'>;

const CommentsScreen = () => {
  const [comment, setComment] = useState('');
  const {
    params: {postId, postComments},
  } = useRoute<CommentsScreenRouteProp>();
  const user = useSelector(selectUser);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [tempPostComments, setTempPostComments] = useState<StoreComment[]>([]);
  const isFocused = useIsFocused();

  const fetchPostComments = async () => {
    const result = await getPostComments(client, postId);
    setComments(result!);
  };

  useEffect(() => {
    if (isFocused) {
      if (postComments?.length > 0 || postComments) {
        fetchPostComments();
      }
    }
  }, [isFocused]);

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

    let tempComments: StoreComment[];

    if (tempPostComments.length > 0) {
      tempComments = [...tempPostComments, commentForPost];
    } else {
      tempComments =
        postComments?.length > 0 || postComments
          ? [...postComments, commentForPost]
          : [commentForPost];
      setTempPostComments(tempComments);
    }
    setComment('');
    setComments([commentObj, ...comments]);
    await storePostComment(commentObj, tempComments, postId);
  };

  const createTempStoreComments = (
    tempStoreComments: StoreComment[],
    key: string,
    ref: string,
  ) => {
    tempStoreComments = [
      ...tempStoreComments,
      {
        _key: key,
        _ref: ref,
        _type: 'reference',
      },
    ];

    return tempStoreComments;
  };

  const deleteComment = async (commentId: string) => {
    let newComments = comments;
    const cmntIndex = newComments.findIndex(
      comment => comment._id === commentId,
    );
    newComments = [
      ...newComments.slice(0, cmntIndex),
      ...newComments.slice(cmntIndex + 1),
    ];
    setComments(newComments);

    let tempStoreComments: StoreComment[] = [];

    newComments.map(comment => {
      tempStoreComments = createTempStoreComments(
        tempStoreComments,
        comment._key,
        comment._id!,
      );
    });

    await deletePostComment(commentId, tempStoreComments!, postId, client);
  };

  const renderCommentInput = () => (
    <View className="flex flex-row mt-auto p-2 bg-transparent items-center space-x-1">
      <TextInput
        value={comment}
        onChangeText={text => setComment(text)}
        className={`flex-1 text-[16px] bg-[${COLOR_CODE.GREY_2}] text-gray-700 max-h-20 rounded-lg p-3 dark:bg-[${COLOR_CODE.GREY_3}] dark:text-gray-300`}
        placeholder="Enter comment here...."
        placeholderTextColor="gray"
        multiline
        textAlignVertical="center"
      />
      <TouchableOpacity onPress={sendComment} activeOpacity={0.5}>
        <Text className={`text-[${COLOR_CODE.BROWN_3}] text-lg`}>Send</Text>
      </TouchableOpacity>
    </View>
  );

  const renderComment = ({item}: any) => (
    <CommentComponent
      key={item._id}
      comment={item}
      deleteComment={deleteComment}
    />
  );

  const renderEmptyComments = () => {
    return (
      <View className="bg-white h-screen flex-1 justify-center items-center dark:bg-[#151515]">
        <ActivityIndicator size="large" color={COLOR_CODE.BROWN_3} />
      </View>
    );
  };

  return (
    <View className="bg-white flex-1 dark:bg-[#151515]">
      {(postComments?.length === 0 || !postComments) &&
      comments.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="font-bold text-gray-600 dark:text-gray-200 text-xl text-center">
            No Comments yet on this post.
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-200 text-center mt-2">
            Be the first one to comment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderComment}
          ListEmptyComponent={renderEmptyComments}
          // @ts-ignore
          keyExtractor={item => item._id}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingBottom: 15}}
        />
      )}

      {renderCommentInput()}
    </View>
  );
};

export default CommentsScreen;
