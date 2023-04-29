import {SanityClient} from '@sanity/client';

const storePostComment = async (
  commentObj: PostComment,
  commentForPost: StoreComment,
  postId: string,
  client: SanityClient,
) => {
  client.create(commentObj).then(() => {
    client
      .patch(postId)
      .setIfMissing({postComments: []})
      .insert('after', 'postComments[-1]', [commentForPost])
      .commit({
        autoGenerateArrayKeys: true,
      });
  });
};

export default storePostComment;
