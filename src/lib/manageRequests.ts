import {setFriendRequests} from '../slices/friendRequestsSlice';

export const manageRequests = (
  userId: string,
  friendRequests: FriendRequest[],
  dispatch: any,
) => {
  let newRequests = friendRequests;
  const requestIndex = newRequests.findIndex(
    (request: FriendRequest) => request._id === userId,
  );
  newRequests = [
    ...newRequests.slice(0, requestIndex),
    ...newRequests.slice(requestIndex + 1),
  ];
  dispatch(setFriendRequests(newRequests));
};
