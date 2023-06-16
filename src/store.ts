import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import muteVideoReducer from './slices/muteVideoSlice';
import friendRequestsReducer from './slices/friendRequestsSlice';
import focusCommentInputReducer from './slices/focusCommentInputSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    muteVideo: muteVideoReducer,
    friendRequests: friendRequestsReducer,
    focusCommentInput: focusCommentInputReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
