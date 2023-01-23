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

interface StorePost extends Base {
  title: string;
  subTitle?: string;
  imageUrl?: Image;
  user: {
    _ref: string;
    _type: Reference;
  };
}
