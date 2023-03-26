type Base = {
  _createdAt?: string;
  _id?: string;
  _rev?: string;
  _type: string;
  _updatedAt?: string;
};

interface Image {
  _type: 'image';
  asset: Reference;
}

interface SanityLikeUser extends Base {
  _ref: string;
  _key: string;
  _type: Reference;
}

interface StorePost extends Base {
  title: string;
  subTitle?: string;
  imageUrl?: Image;
  user: {
    _ref: string;
    _type: Reference;
  };
  likes?: SanityLikeUser[];
}

interface StoreComment extends Base {
  _ref: string;
  _key: string;
  _type: Reference;
}

interface FriendRequest extends Base {
  displayName: string;
  photoURL: string;
}

interface SearchUser {
  _id: string;
  displayName: string;
  photoURL: string;
}

interface SanityUser {
  _ref: string;
  _type: string;
}

interface SanityChat extends Base {
  _key: string;
  userOne: SanityUser;
  userTwo: SanityUser;
  messages: SanityMessageForChatDocument[];
}

interface SanityMessageForChatDocument extends Base {
  _key: string;
  _ref: string;
  _type: Reference;
}

interface SanityMessage extends Base {
  user: SanityUser;
  message: string;
  seen: boolean;
}
