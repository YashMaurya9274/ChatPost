import {SanityClient} from '@sanity/client';
import groq from 'groq';
import getAllUsers from './getAllUsers';

const getTenUsers = async (client: SanityClient, userId: string) => {
  let usersLength: number;
  let randomNumber: number;

  const resultUsers = await getAllUsers(client);
  usersLength = resultUsers?.length - 1;
  if (usersLength >= 9) {
    randomNumber = Math.floor(Math.random() * (usersLength - 8));
  } else {
    randomNumber = 0;
  }

  // FOR INCLUSIVE USE -> [0..9] (FIRST 10 RECORDS), FOR EXCLUSIVE USE -> [0...9] (FIRST 9 RECORDS)
  const query = groq`
  *[_type=="users" && _id != '${userId}'][${randomNumber}..${
    randomNumber + 9
  }] {
      _id,
      displayName,
      photoURL
  }
`;
  const params = {};

  const res = await client.fetch(query, params);
  return res;
};

export default getTenUsers;
