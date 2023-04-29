import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import storePostComment from './storePostComment';
import deletePostComment from './deletePostComment';
import {SanityClient} from '@sanity/client';
import {client} from './client';

export const sendComment = async (
  comment: string,
  comments: PostComment[],
  userId: string,
  postId: string,
  setComment: (value: React.SetStateAction<string>) => void,
  setComments: (value: React.SetStateAction<PostComment[]>) => void,
) => {
  if (!comment) return;

  const commentObj: PostComment = {
    _id: uuidv4(),
    _key: uuidv4(),
    _type: 'comments',
    comment: comment,
    user: {
      _ref: userId,
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

  setComment('');
  setComments([commentObj, ...comments]);
  await storePostComment(commentObj, commentForPost, postId, client);
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

export const deleteComment = async (
  commentId: string,
  comments: PostComment[],
  setComments: (value: React.SetStateAction<PostComment[]>) => void,
  postId: string,
  client: SanityClient,
) => {
  let newComments = comments;
  const cmntIndex = newComments.findIndex(comment => comment._id === commentId);
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
