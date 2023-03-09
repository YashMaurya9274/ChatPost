import {SanityClient} from '@sanity/client';
import groq from 'groq';
import {FRIEND_REQUEST_STATUS} from '../enums';

const getFriendRequestReceivingStatus = async (
  client: SanityClient,
  userId: string,
  otherUserId: String,
) => {
  const query = groq`
        *[_type == 'users' && _id == '${userId}'] {
            friendRequestsReceived[_ref  ==  '${otherUserId}']
        }
    `;
  const params = {};

  const res = await client.fetch(query, params);

  if (res[0].friendRequestsReceived?.length === 1) {
    return FRIEND_REQUEST_STATUS.ACCEPT_REQUEST;
  }
  // return FRIEND_REQUEST_STATUS.ADD_FRIEND;
};

export default getFriendRequestReceivingStatus;
