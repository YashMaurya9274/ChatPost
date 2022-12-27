export type Post = {
  id: string;
  title: string;
  subTitle?: string;
  imageUrl?: string;
  videoUrl?: string;
  timestamp: number;
  userImage: string;
  userName: string;
};

export type User = {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
};

export type UserInfo = {
  user: User;
  userPosts?: Post[];
};

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
