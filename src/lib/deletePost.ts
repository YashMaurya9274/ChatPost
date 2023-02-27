import {SANITY_API_TOKEN} from '@env';
import groq from 'groq';
import {client} from './client';
import mutationUrl from './mutationUrl';

const deletePost = async (postId: string) => {
  const mutations = [
    {
      patch: {
        id: postId,
        set: {
          postComments: [],
        },
      },
    },
    {
      delete: {
        query: groq`*[_type == 'comments' && post._ref == "${postId}"]`,
      },
    },
    {
      delete: {
        id: postId,
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

  console.log(response);

  // response.json().then(() => {
  //   // comments.map(comment => client.delete(comment._ref));
  //   client.delete(postId);
  // });
};

export default deletePost;
