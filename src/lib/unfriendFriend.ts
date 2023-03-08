import {SanityClient} from '@sanity/client';

const unfriendFriend = async (
  client: SanityClient,
  currentUserId: string,
  friendUserId: string,
) => {
  client
    .patch(currentUserId)
    // Delete the items from the array
    .unset([`friends[_ref=="${friendUserId}"]`])
    .commit();

  client
    .patch(friendUserId)
    // Delete the items from the array
    .unset([`friends[_ref=="${currentUserId}"]`])
    .commit();
};

export default unfriendFriend;
