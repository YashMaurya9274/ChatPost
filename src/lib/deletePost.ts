import {client} from './client';

const deletePost = (postId: string) => {
  client.delete(postId).then(() => console.log('deleted'));
};

export default deletePost;
