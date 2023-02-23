import {SANITY_API_TOKEN} from '@env';
import {SanityClient} from '@sanity/client';
import mutationUrl from './mutationUrl';

const deletePostComment = async (
  commentId: string,
  comments: StoreComment[],
  postId: string,
  client: SanityClient,
) => {
  const mutations = [
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

  const result = response.json().then(() => client.delete(commentId));
};

export default deletePostComment;
