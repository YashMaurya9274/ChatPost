import {SanityClient} from '@sanity/client';
import groq from 'groq';
import {FRIEND_REQUEST_STATUS} from '../enums';

const getFriendRequestSentStatus = async (
  client: SanityClient,
  userId: string,
  otherUserId: String,
) => {
  const query = groq`
        *[_type == 'users' && _id == '${userId}'] {
          friendRequestsSent[_ref  ==  '${otherUserId}']
        }
    `;
  const params = {};

  const res = await client.fetch(query, params);

  if (res[0].friendRequestsSent?.length === 1) {
    return FRIEND_REQUEST_STATUS.FRIEND_REQUEST_SENT;
  }
  return FRIEND_REQUEST_STATUS.ADD_FRIEND;
};

export default getFriendRequestSentStatus;
