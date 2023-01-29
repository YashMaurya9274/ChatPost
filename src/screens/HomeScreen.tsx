import {View, StatusBar, useColorScheme, FlatList} from 'react-native';
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {Post} from '../types/typings';
import PostComponent from '../components/PostComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {TabStackParamList} from '../navigator/TabNavigator';
import {client} from '../lib/client';
import useFetchPostListener from '../lib/useFetchPostListener';

export type HomeScreenNavigationProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<TabStackParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const scheme = useColorScheme();
  const {posts} = useFetchPostListener(client);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Posts',
    });
  }, [navigation, scheme]);

  const renderPost = ({item}: any) => (
    <PostComponent key={item._id} post={item} />
  );

  return (
    <View className="bg-white min-h-full dark:bg-[#151515]">
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={scheme === 'dark' ? '#151515' : 'white'}
      />
      {/* <ScrollView bounces contentContainerStyle={{paddingBottom: 15}}>
        {posts.map((post: Post) => (
          <PostComponent key={post.id} post={post} />
        ))}
      </ScrollView> */}

      <FlatList
        data={posts}
        renderItem={renderPost}
        // @ts-ignore
        keyExtractor={item => item._id}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: 15}}
      />
    </View>
  );
};

export default HomeScreen;
