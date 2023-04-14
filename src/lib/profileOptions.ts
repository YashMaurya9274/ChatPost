import ImageLinks from '../assets/images';
import {PROFILE_OPTIONS} from '../enums';

export const profileOptions = [
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
