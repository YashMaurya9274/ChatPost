import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getPosts = async (client: SanityClient) => {
  const query = groq`
        *[_type == 'posts'] | order(_createdAt desc)  {
            ...,
            user ->
        }
    `;
  const params = {};

  const res = await client.fetch(query, params);
  return res;
};

export default getPosts;
