import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getPost = async (client: SanityClient, postId: string) => {
  const query = groq`
        *[_type == 'posts' && _id == '${postId}']  {
            ...,
            user -> ,
            "postComments": *[_type == "comments" && post._ref == '${postId}'] | order(_createdAt desc) {
              ...,
              user -> {
                _id,
                displayName,
                photoURL
              }
            }
        }
    `;
  const params = {};

  const res = await client.fetch(query, params);
  return res[0];
};

export default getPost;
