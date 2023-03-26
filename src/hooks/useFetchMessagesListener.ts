import {SanityClient} from '@sanity/client';
import groq from 'groq';
import {useEffect, useState} from 'react';

const useFetchMessageListener = (
  client: SanityClient,
  userId: string,
  friendId: string,
) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  //Listen for data changes in Sanity
  const query = groq`
    *[_type == 'chats' && (userOne._ref == '${userId}' || userTwo._ref == '${userId}') && (userOne._ref == '${friendId}' || userTwo._ref == '${friendId}')] {
        messages[] -> {
            ...,
            user -> {
                _id,
                displayName,
                photoURL
            }
        }
    }
    `;
  const params = {};

  fetchMessages();

  //   useEffect(() => {
  //     const subscription = client
  //       .listen(query, params)
  //       .subscribe(newSanityMessages => {
  //         let sanityMessage = newSanityMessages.result;
  //         let sanityMessages: any = [...messages, sanityMessage];
  //         setMessages(sanityMessages);
  //       });

  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   }, [client]);

  function fetchMessages() {
    client.fetch(query, params).then(result => {
      setChatMessages(result[0]?.messages?.reverse());
    });
  }

  return {chatMessages, setChatMessages};
};

export default useFetchMessageListener;
