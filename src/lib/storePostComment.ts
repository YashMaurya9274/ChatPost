import {SANITY_API_TOKEN} from '@env';
import {PostComment} from '../types/typings';
import mutationUrl from './mutationUrl';

const storePostComment = async (
  comment: PostComment,
  comments: StoreComment[],
  postId: string,
) => {
  const mutations = [
    {
      create: comment,
    },
    {
      patch: {
        id: postId,
        set: {
          postComments: comments,
        },
      },
    },
  ];

  const response = await fetch(mutationUrl, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
    },
    body: JSON.stringify({mutations}),
  });
  const result = await response.json();
};

export default storePostComment;
