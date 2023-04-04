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

interface LikedUser extends Base {
  displayName: string;
  photoURL: string;
}

interface LikeUser {
  _ref: string;
  _key: string;
  _type: Reference;
}

interface Post extends Base {
  title: string;
  subTitle?: string;
  imageUrl?: Image;
  // videoUrl?: string;
  user: User;
  likes?: LikeUser[];
  postComments?: StoreComment[];
}

interface User extends Base {
  displayName: string;
  email: string;
  photoURL: string;
}

interface UserData extends User {
  posts?: Post[];
}

interface PostComment extends Base {
  _key: string;
  comment: string;
  user: {
    _ref: string;
    _type: Reference;
  };
  post: {
    _ref: string;
    _type: Reference;
  };
}

interface Friend extends Base {
  displayName: string;
  photoURL: string;
}

interface Chat extends Base {
  userOne: User;
  userTwo: User;
  messages: Message[];
}

interface Message extends Base {
  user: User;
  message: string;
  seen: boolean;
}
