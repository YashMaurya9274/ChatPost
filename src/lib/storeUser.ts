import {
  NEXT_PUBLIC_SANITY_API_VERSION,
  NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_PROJECT_ID,
  SANITY_API_TOKEN,
} from '@env';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

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

  const url = `https://${NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${NEXT_PUBLIC_SANITY_API_VERSION}/data/mutate/${NEXT_PUBLIC_SANITY_DATASET}`;

  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
    },
    body: JSON.stringify({mutations}),
  });
  const result = await response.json();
  console.log(result);
};

export default storeUser;
