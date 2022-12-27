import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

const initialState = {
  muteVideo: true,
};

export const muteVideoSlice = createSlice({
  name: 'muteVideo',
  initialState,
  reducers: {
    setMuteVideo: (state, action) => {
      state.muteVideo = action.payload;
    },
  },
});

export const {setMuteVideo} = muteVideoSlice.actions;

export const selectMuteVideo = (state: RootState) => state.muteVideo.muteVideo;

export default muteVideoSlice.reducer;
