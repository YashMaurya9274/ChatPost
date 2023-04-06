import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getLikedUsersInfo = async (client: SanityClient, postId: string) => {
  const query = groq`
    *[_type == 'posts' && _id == '${postId}'] | order(_createdAt desc)  {
        likes[] -> {
          _id,
          displayName,
          photoURL
        }
    }
    `;
  const params = {};
  const res = await client.fetch(query, params);
  return res;
};

export default getLikedUsersInfo;
