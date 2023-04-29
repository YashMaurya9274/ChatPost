import likePostMutation from './likePostMutation';

export const checkUserLiked = (
  postLikes: LikeUser[] | undefined,
  userId: string,
) => {
  const tempLikes = postLikes;
  let result = false;
  if (tempLikes && tempLikes?.length! > 0) {
    tempLikes?.map(postLike => {
      if (postLike?._ref === userId) {
        result = true;
      }
    });
  }

  return result;
};

const getUserLikedIndex = (likes: LikeUser[] | undefined, userId: string) => {
  let result = -1;
  if (likes && likes?.length! > 0) {
    likes?.map(postLike => {
      if (postLike?._ref === userId) {
        result = likes.indexOf(postLike);
      }
    });
  }

  return result;
};

export const handleLikePost = async (
  likes: LikeUser[] | undefined,
  setLiked: (value: React.SetStateAction<boolean>) => void,
  setLikes: (value: React.SetStateAction<LikeUser[] | undefined>) => void,
  userId: string,
  postId: string,
) => {
  let tempLikes = likes || [];
  if (checkUserLiked(likes, userId)) {
    tempLikes?.splice(getUserLikedIndex(likes, userId), 1);
    setLiked(false);
  } else {
    const userLike: SanityLikeUser = {
      _type: 'reference',
      _ref: userId,
      _key: userId,
    };
    setLikes([...(likes || []), userLike]);
    tempLikes = [...tempLikes!, userLike];
    setLiked(true);
  }

  const res = await likePostMutation(tempLikes!, postId);
};
