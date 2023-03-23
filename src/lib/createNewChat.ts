import {SanityClient} from '@sanity/client';
import {v4 as uuidv4} from 'uuid';

const createNewChat = async (
  client: SanityClient,
  userId: string,
  friendId: string,
  userOne: {
    _ref: string;
    _type: string;
  },
  userTwo: {
    _ref: string;
    _type: string;
  },
  message: string,
) => {
  const messageObject = {
    _id: uuidv4(),
    _key: uuidv4(),
    _type: 'messages',
    message: message,
    // @ts-ignore
    user: userOne,
    seen: false,
  };

  const messageObjectForChatDocument = {
    _key: messageObject._key,
    _ref: messageObject._id,
    _type: 'reference',
  };

  const chatObject: SanityChat = {
    _id: uuidv4(),
    _key: uuidv4(),
    _type: 'chats',
    messages: [messageObjectForChatDocument],
    userOne: userOne,
    userTwo: userTwo,
  };

  const chatObjectForUserDocument = {
    _key: chatObject._key,
    _ref: chatObject._id,
    _type: 'reference',
  };

  client.create(messageObject);

  client.create(chatObject).then(() => {
    client
      .patch(userId)
      .setIfMissing({userChats: []})
      .insert('after', 'userChats[-1]', [chatObjectForUserDocument])
      .commit();

    client
      .patch(friendId)
      .setIfMissing({userChats: []})
      .insert('after', 'userChats[-1]', [chatObjectForUserDocument])
      .commit();
  });

  // client
  //   .patch(friendId)
  //   .setIfMissing({userChats: []})
  //   .insert('after', 'userChats[-1]', [chatObjectForUserDocument])
  //   .commit()
  //   .catch(err => console.log('ERROR', err));
};

export default createNewChat;
