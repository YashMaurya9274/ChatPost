import {View, FlatList, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigator/RootNavigator';
import CommentComponent from '../components/CommentComponent';
import {client} from '../lib/client';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import getPostComments from '../lib/getPostComments';
import NoDataComponent from '../components/NoDataComponent';
import CommentInput from '../components/CommentInput';
import {deleteComment, sendComment} from '../lib/commentFunctions';

type CommentsScreenRouteProp = RouteProp<RootStackParamList, 'Comments'>;

const CommentsScreen = () => {
  const [comment, setComment] = useState('');
  const {
    params: {postId, postComments},
  } = useRoute<CommentsScreenRouteProp>();
  const user = useSelector(selectUser);
  const [comments, setComments] = useState<PostComment[]>([]);
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

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId, comments, setComments, postId, client);
  };

  const renderComment = ({item}: any) => (
    <CommentComponent
      key={item._id}
      comment={item}
      deleteComment={handleDeleteComment}
    />
  );

  const renderEmptyComments = () => {
    return (
      <View className="bg-white h-screen flex-1 justify-center items-center dark:bg-[#151515]">
        <ActivityIndicator size="large" color="#9e6969" />
      </View>
    );
  };

  return (
    <View className="bg-white flex-1 dark:bg-[#151515]">
      {(postComments?.length === 0 || !postComments) &&
      comments.length === 0 ? (
        <NoDataComponent
          title="No Comments yet on this post."
          subTitle="Be the first one to comment."
        />
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

      <CommentInput
        comment={comment}
        onChangeComment={(text: string) => setComment(text)}
        handleComment={handleComment}
        userPhoto={user.photoURL}
      />
    </View>
  );
};

export default CommentsScreen;
