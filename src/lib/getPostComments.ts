import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getPostComments = async (client: SanityClient, postId: string) => {
  const query = groq`
    *[_type == 'posts' && _id == '${postId}'] {
        ...,
        "postComments": *[_type == "comments" && post._ref == '${postId}'] | order(_createdAt desc) {
          ...,
          user->
        }
      }
    `;
  const params = {};

  const res = await client.fetch(query, params);
  return res[0].postComments;
};

export default getPostComments;
