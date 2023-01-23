import {SANITY_API_TOKEN} from '@env';
import mutationUrl from './mutationUrl';

const storePost = async (post: StorePost) => {
  console.log(post);
  const mutations = [
    {
      create: post,
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
  console.log(result);
};

export default storePost;
