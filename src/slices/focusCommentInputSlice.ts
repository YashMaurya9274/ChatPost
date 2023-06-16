import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

export type CommentInputType = {
  focusComment: boolean;
  commentUserName?: string;
};

const initialState: any = {
  focusCommentInput: <CommentInputType>{
    commentUserName: '',
    focusComment: false,
  },
};

export const userSlice = createSlice({
  name: 'focusCommentInput',
  initialState,
  reducers: {
    setFocusCommentInput: (state, action) => {
      state.focusCommentInput.focusComment = action.payload.focusComment;
      state.focusCommentInput.commentUserName = action.payload.commentUserName;
    },
  },
});

export const {setFocusCommentInput} = userSlice.actions;

export const selectFocusCommentInput = (state: RootState) =>
  state.focusCommentInput.focusCommentInput;

export default userSlice.reducer;
