import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

const initialState: any = {
  friendRequests: <FriendRequest[] | null>null,
};

export const friendRequestsSlice = createSlice({
  name: 'friendRequests',
  initialState,
  reducers: {
    setFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
    },
  },
});

export const {setFriendRequests} = friendRequestsSlice.actions;

export const selectFriendRequests = (state: RootState) =>
  state.friendRequests.friendRequests;

export default friendRequestsSlice.reducer;
