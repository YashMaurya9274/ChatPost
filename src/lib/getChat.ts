import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getChat = async (
  client: SanityClient,
  userId: string,
  friendId: string,
) => {
  const query = groq`
    *[_type == 'chats' && (userOne._ref == '${userId}' || userTwo._ref == '${userId}') && (userOne._ref == '${friendId}' || userTwo._ref == '${friendId}')] {
        _id,
        messages[] -> {
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

export default getChat;
