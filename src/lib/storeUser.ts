import {SANITY_API_TOKEN} from '@env';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import mutationUrl from './mutationUrl';

const storeUser = async (user: FirebaseAuthTypes.User | null) => {
  const mutations = [
    {
      createIfNotExists: {
        _type: 'users',
        _id: user?.uid!,
        displayName: user?.displayName,
        email: user?.email,
        photoURL: user?.photoURL,
      },
    },
  ];

  const response = await fetch(mutationUrl, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
    },
    body: JSON.stringify({mutations}),
  });
  const result = await response.json();
};

export default storeUser;
