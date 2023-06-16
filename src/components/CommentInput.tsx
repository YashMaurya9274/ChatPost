import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ImageLinks from '../assets/images';
import {useDispatch, useSelector} from 'react-redux';
import {
  CommentInputType,
  selectFocusCommentInput,
  setFocusCommentInput,
} from '../slices/focusCommentInputSlice';

type Props = {
  comment: string;
  onChangeComment: (text: string) => void;
  handleComment: () => Promise<void>;
  userPhoto: string;
};

const CommentInput = ({
  comment,
  onChangeComment,
  handleComment,
  userPhoto,
}: Props) => {
  const scheme = useColorScheme();
  const inputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();
  const [replyToUserName, setReplyToUserName] = useState('');

  const focusCommentInput: CommentInputType = useSelector(
    selectFocusCommentInput,
  );

  useEffect(() => {
    if (focusCommentInput.focusComment) {
      inputRef.current?.focus();
      setReplyToUserName(focusCommentInput.commentUserName!);
      dispatch(
        setFocusCommentInput({
          focusCommentInput: false,
          commentUserName: '',
        }),
      );
    }
  }, [focusCommentInput.focusComment]);

  useEffect(() => {
    if (replyToUserName) {
      onChangeComment(replyToUserName + ' ');
    }
  }, [replyToUserName]);

  return (
    <View
      className={`flex flex-row mt-auto p-2 bg-transparent items-center space-x-2 border-t border-[#dbdde0] ${
        scheme === 'dark' && 'border-[#3A3B3C]'
      }`}>
      <Image source={{uri: userPhoto}} className="h-9 w-9 rounded-full" />
      <TextInput
        ref={inputRef}
        value={comment}
        onChangeText={onChangeComment}
        className="flex-1 text-[16px] bg-[#F0F2F5] text-gray-700 max-h-20 rounded-xl py-2 px-3 dark:bg-[#3A3B3C] dark:text-gray-300"
        placeholder="Write comment here...."
        placeholderTextColor="gray"
        multiline
        textAlignVertical="center"
      />
      <TouchableOpacity
        onPress={handleComment}
        className="bg-[#9e6969] items-center justify-center p-2 rounded-full"
        activeOpacity={0.3}>
        <Image source={ImageLinks.send} className="h-5 w-5" />
      </TouchableOpacity>
    </View>
  );
};

export default CommentInput;
