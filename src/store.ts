import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import muteVideoReducer from './slices/muteVideoSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    muteVideo: muteVideoReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
