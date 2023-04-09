import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getSentRequests = async (client: SanityClient, userId: string) => {
  const query = groq`
        *[_type == 'users' && _id == '${userId}'] {
            friendRequestsSent[]->{
                _id,
                displayName,
                photoURL,
            }
        }
    `;
  const params = {};

  const res = await client.fetch(query, params);

  return res[0].friendRequestsSent;
};

export default getSentRequests;
