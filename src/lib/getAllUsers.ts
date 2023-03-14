import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getAllUsers = async (client: SanityClient) => {
  const query = groq`
    *[_type == 'users'] {
        _id,
        displayName,
        photoURL,
      }
    `;
  const params = {};

  const res = await client.fetch(query, params);
  return res;
};

export default getAllUsers;
