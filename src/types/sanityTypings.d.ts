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
