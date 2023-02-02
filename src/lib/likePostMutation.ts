import {SANITY_API_TOKEN} from '@env';
import mutationUrl from './mutationUrl';

const likePostMutation = async (likes: SanityLikeUser[], postId: string) => {
  const mutations = [
    {
      patch: {
        id: postId,
        set: {
          likes: likes,
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
  return result;
};

export default likePostMutation;
