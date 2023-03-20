import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getChats = async (client: SanityClient, userId: string) => {
  const query = groq`
    *[_type=="users" && _id == '${userId}'] {
      _id,
      userChats[] -> {
        ...,
        messages[] -> {
          ...,
          user ->
        },
        userOne-> {
          _id,
          displayName,
          photoURL
        },
        userTwo->{
          _id,
          displayName,
          photoURL
        }
      }
    }
    `;
  const params = {};

  const res = await client.fetch(query, params);
  return res[0].userChats;
};

export default getChats;
