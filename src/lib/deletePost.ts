import {client} from './client';

const deletePost = (postId: string) => {
  client.delete(postId);
};

export default deletePost;
