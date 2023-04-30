import {ImageSourcePropType} from 'react-native';
import ImageLinks from '../assets/images';
import {POST_OPTIONS, PROFILE_OPTIONS} from '../enums';

export type Option = {
  title: string;
  imageSource: ImageSourcePropType;
  color?: string;
};

export const profileOptions: Option[] = [
  {
    title: PROFILE_OPTIONS.MANAGE_SENT_REQUESTS,
    imageSource: ImageLinks.manageFriendRequests,
  },
  {
    title: PROFILE_OPTIONS.INVITE_YOUR_FRIENDS,
    imageSource: ImageLinks.share.curvedRightShareArrow,
  },
  {
    title: PROFILE_OPTIONS.ABOUT,
    imageSource: ImageLinks.aboutInfo,
  },
];

export const postOptions: Option[] = [
  {
    title: POST_OPTIONS.SHARE_POST,
    imageSource: ImageLinks.share.shareThreeDots,
  },
  {
    title: POST_OPTIONS.DELETE_POST,
    imageSource: ImageLinks.deleteIcon,
    color: '#FF5959',
  },
];
