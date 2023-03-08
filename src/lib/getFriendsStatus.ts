import {SanityClient} from '@sanity/client';
import groq from 'groq';
import {FRIEND_REQUEST_STATUS} from '../enums';

const getFriendsStatus = async (
  client: SanityClient,
  userId: string,
  otherUserId: String,
) => {
  const query = groq`
        *[_type == 'users' && _id == '${userId}'] {
          friends[_ref  ==  '${otherUserId}']
        }
    `;
  const params = {};

  const res = await client.fetch(query, params);

  if (res[0].friends?.length === 1) {
    return FRIEND_REQUEST_STATUS.UNFRIEND;
  }
};

export default getFriendsStatus;
