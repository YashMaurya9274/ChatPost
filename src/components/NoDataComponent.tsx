import {View, Text} from 'react-native';
import React from 'react';

type Props = {
  title: string;
  subTitle: string;
};

const NoDataComponent = ({title, subTitle}: Props) => {
  return (
    <View className="flex h-screen justify-center items-center">
      <Text className="font-bold text-gray-600 dark:text-gray-200 text-xl text-center">
        {title}
      </Text>
      <Text className="text-base text-gray-600 dark:text-gray-200 text-center mt-2 mb-32">
        {subTitle}
      </Text>
    </View>
  );
};

export default NoDataComponent;
