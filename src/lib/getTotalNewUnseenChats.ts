import {SanityClient} from '@sanity/client';
import groq from 'groq';

const getTotalNewUnseenChats = async (client: SanityClient, userId: string) => {
  const query = groq`
      *[_type == 'chats' && (userOne._ref == '${userId}' || userTwo._ref == '${userId}')] {
          messages[] -> {
              seen,
              user
          }
      }
    `;
  const params = {};

  const res = await client.fetch(query, params);
  let newUnseenChats = 0;

  res.forEach((result: any) => {
    const user = result.messages?.find((message: Message) => !message.seen);
    if (user && user?.user?._ref !== userId) {
      newUnseenChats += 1;
    }
  });

  return newUnseenChats;
};

export default getTotalNewUnseenChats;
