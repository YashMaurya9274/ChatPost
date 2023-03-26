import {SanityClient} from '@sanity/client';

const updateSeenStatus = async (client: SanityClient, idsArray: string[]) => {
  const updateStatus = (id: string) => {
    client.patch(id).set({seen: true}).commit();
  };

  idsArray.forEach(id => {
    updateStatus(id);
  });
};

export default updateSeenStatus;
