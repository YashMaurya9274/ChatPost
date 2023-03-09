import {SanityClient} from '@sanity/client';

const removeFriendRequest = async (
  client: SanityClient,
  requestSenderUserId: string,
  requestReceiverUserId: string,
) => {
  client
    .patch(requestSenderUserId)
    // Delete the items from the array
    .unset([`friendRequestsSent[_ref=="${requestReceiverUserId}"]`])
    .commit();

  client
    .patch(requestReceiverUserId)
    // Delete the items from the array
    .unset([`friendRequestsReceived[_ref=="${requestSenderUserId}"]`])
    .commit();
};

export default removeFriendRequest;
