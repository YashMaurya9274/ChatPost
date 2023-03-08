import {SanityClient} from '@sanity/client';

const acceptFriendRequest = async (
  client: SanityClient,
  requestSenderUserId: string,
  requestReceiverUserId: string,
  requestReceiverUser: any,
  requestSenderUser: any,
) => {
  client
    .patch(requestSenderUserId)
    // Ensure that the `members` arrays exists before attempting to add items to it
    .setIfMissing({friends: []})
    // Add the items after the last item in the array (append)
    // Adding friend
    .insert('after', 'friends[-1]', [requestReceiverUser])
    .commit({
      // Adds a `_key` attribute to array items, unique within the array, to
      // ensure it can be addressed uniquely in a real-time collaboration context
      autoGenerateArrayKeys: true,
    });

  client
    .patch(requestReceiverUserId)
    // Ensure that the `members` arrays exists before attempting to add items to it
    .setIfMissing({friends: []})
    // Add the items after the last item in the array (append)
    // Adding friend
    .insert('after', 'friends[-1]', [requestSenderUser])
    .commit({
      // Adds a `_key` attribute to array items, unique within the array, to
      // ensure it can be addressed uniquely in a real-time collaboration context
      autoGenerateArrayKeys: true,
    });

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

export default acceptFriendRequest;
