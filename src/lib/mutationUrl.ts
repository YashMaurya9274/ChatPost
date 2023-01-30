import {
  NEXT_PUBLIC_SANITY_API_VERSION,
  NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_PROJECT_ID,
} from '@env';

const mutationUrl = `https://${NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${NEXT_PUBLIC_SANITY_API_VERSION}/data/mutate/${NEXT_PUBLIC_SANITY_DATASET}`;

export default mutationUrl;
