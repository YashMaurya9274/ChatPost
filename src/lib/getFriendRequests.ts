import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getFriendsRequests = async (client: SanityClient, userId: string) => {
  const query = groq`
        *[_type == 'users' && _id == '${userId}'] {
            friendRequestsReceived[]->{
                _id,
                displayName,
                photoURL,
            }
        }
    `;
  const params = {};

  const res = await client.fetch(query, params);

  return res[0].friendRequestsReceived;
};

export default getFriendsRequests;
