import {SanityClient} from '@sanity/client';

const sendFriendRequest = async (
  client: SanityClient,
  requestSenderUserId: string,
  requestReceiverUserId: string,
  requestReceiverUser: any,
  requestSenderUser: any,
) => {
  client
    .patch(requestSenderUserId)
    // Ensure that the `members` arrays exists before attempting to add items to it
    .setIfMissing({friendRequestsSent: []})
    // Add the items after the last item in the array (append)
    .insert('after', 'friendRequestsSent[-1]', [requestReceiverUser])
    .commit({
      // Adds a `_key` attribute to array items, unique within the array, to
      // ensure it can be addressed uniquely in a real-time collaboration context
      autoGenerateArrayKeys: true,
    });

  client
    .patch(requestReceiverUserId)
    // Ensure that the `members` arrays exists before attempting to add items to it
    .setIfMissing({friendRequestsReceived: []})
    // Add the items after the last item in the array (append)
    .insert('after', 'friendRequestsReceived[-1]', [requestSenderUser])
    .commit({
      // Adds a `_key` attribute to array items, unique within the array, to
      // ensure it can be addressed uniquely in a real-time collaboration context
      autoGenerateArrayKeys: true,
    });
};

export default sendFriendRequest;
