import {View} from 'react-native';
import React from 'react';
import {BottomSheet} from '@rneui/themed';

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

const RNBottomSheet = ({
  children,
  isVisible,
  onBackdropPress,
  bottomSheetHeight,
}: Props) => {
  return (
    <BottomSheet
      modalProps={{}}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}>
      <View
        className={`bg-white dark:bg-[#1b1b1b] h-[${bottomSheetHeight}px] rounded-t-3xl pb-3`}>
        <View className="h-1 w-16 bg-gray-400 dark:bg-gray-300 mx-auto mt-4 rounded-lg mb-4" />

        {children}
      </View>
    </BottomSheet>
  );
};

export default RNBottomSheet;
