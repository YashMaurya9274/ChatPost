import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getUserData = async (client: SanityClient, userId: string) => {
  const query = groq`
        *[_type == 'users' && _id == '${userId}'] {
            ...,
            "posts": *[_type == "posts" && user._ref == '${userId}'] | order(_createdAt desc) {
                ...,
                user->
        }
    }
    `;
  const params = {};

  const res = await client.fetch(query, params);
  return res[0];
};

export default getUserData;
