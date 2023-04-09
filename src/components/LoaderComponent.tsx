import {View, ActivityIndicator} from 'react-native';
import React from 'react';

const LoaderComponent = () => {
  return (
    <View className="bg-white h-screen flex-1 justify-center items-center dark:bg-[#151515]">
      <ActivityIndicator size="large" color="#9e6969" />
    </View>
  );
};

export default LoaderComponent;
