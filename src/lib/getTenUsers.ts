import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getTenUsers = async (client: SanityClient, userId: string) => {
  const query = groq`
        *[_type=="users" && _id != '${userId}'][0..9] {
            _id,
            displayName,
            photoURL
        }
    `;
  const params = {};

  const res = await client.fetch(query, params);
  return res;
};

export default getTenUsers;
