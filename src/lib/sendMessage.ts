import {SanityClient} from '@sanity/client';
import {v4 as uuidv4} from 'uuid';

const sendMessage = async (
  client: SanityClient,
  chatId: string,
  message: string,
  messageSenderUser: {
    _ref: string;
    _type: string;
  },
) => {
  const messageObject = {
    _id: uuidv4(),
    _key: uuidv4(),
    _type: 'messages',
    message: message,
    // @ts-ignore
    user: messageSenderUser,
    seen: false,
  };

  const messageObjectForChatDocument = {
    _key: messageObject._key,
    _ref: messageObject._id,
    _type: 'reference',
  };

  client.create(messageObject).then(() => {
    client
      .patch(chatId)
      .setIfMissing({messages: []})
      .insert('after', 'messages[-1]', [messageObjectForChatDocument])
      .commit({
        autoGenerateArrayKeys: true,
      });
  });

  //   client
  //     .patch(requestSenderUserId)
  //     // Ensure that the `members` arrays exists before attempting to add items to it
  //     .setIfMissing({friendRequestsSent: []})
  //     // Add the items after the last item in the array (append)
  //     .insert('after', 'friendRequestsSent[-1]', [requestReceiverUser])
  //     .commit({
  //       // Adds a `_key` attribute to array items, unique within the array, to
  //       // ensure it can be addressed uniquely in a real-time collaboration context
  //       autoGenerateArrayKeys: true,
  //     });
  //   client
  //     .patch(requestReceiverUserId)
  //     // Ensure that the `members` arrays exists before attempting to add items to it
  //     .setIfMissing({friendRequestsReceived: []})
  //     // Add the items after the last item in the array (append)
  //     .insert('after', 'friendRequestsReceived[-1]', [requestSenderUser])
  //     .commit({
  //       // Adds a `_key` attribute to array items, unique within the array, to
  //       // ensure it can be addressed uniquely in a real-time collaboration context
  //       autoGenerateArrayKeys: true,
  //     });
};

export default sendMessage;
