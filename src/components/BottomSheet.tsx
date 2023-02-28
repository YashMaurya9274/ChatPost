import {View} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';

type Props = {
  children: React.ReactElement;
  isVisible: boolean;
  onSwipeComplete?: (() => void) | undefined;
  onBackdropPress?: (() => void) | undefined;
  onBackButtonPress?: (() => void) | undefined;
  bottomSheetHeight: number;
  animationInTiming?: number;
  animationOutTiming?: number;
  backdropTransitionInTiming?: number;
  backdropTransitionOutTiming?: number;
};

const BottomSheet = ({
  children,
  isVisible,
  onSwipeComplete,
  onBackdropPress,
  onBackButtonPress,
  bottomSheetHeight,
  animationInTiming,
  animationOutTiming,
  backdropTransitionInTiming,
  backdropTransitionOutTiming,
}: Props) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationInTiming={animationInTiming}
      animationOutTiming={animationOutTiming}
      backdropTransitionInTiming={backdropTransitionInTiming}
      backdropTransitionOutTiming={backdropTransitionOutTiming}
      swipeDirection="down"
      className="flex justify-end m-0"
      onSwipeComplete={onSwipeComplete}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackButtonPress}>
      <View
        className={`bg-white dark:bg-[#1b1b1b] h-[${bottomSheetHeight}px] rounded-t-3xl pb-3`}>
        <View className="h-1 w-10 bg-gray-400 dark:bg-gray-300 mx-auto mt-4 rounded-lg mb-4" />

        {children}
      </View>
    </Modal>
  );
};

export default BottomSheet;
