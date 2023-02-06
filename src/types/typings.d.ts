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
}

interface User extends Base {
  displayName: string;
  email: string;
  photoURL: string;
}

interface UserData extends User {
  posts?: Post[];
}

export type Friend = {
  id: string;
  userName: string;
  userImage: string;
};

export type Chat = {
  id: string;
  friendName: string;
  friendImage: string;
  messages: Message[];
};

export type Message = {
  id: string;
  message: string;
  timestamp: number;
  userName: string;
  userImage: string;
};
