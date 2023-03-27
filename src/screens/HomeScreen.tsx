import {
  View,
  StatusBar,
  useColorScheme,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  CompositeNavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import PostComponent from '../components/PostComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {TabStackParamList} from '../navigator/TabNavigator';
import {client} from '../lib/client';
// import useFetchPostListener from '../hooks/useFetchPostListener';
import getPosts from '../lib/getPosts';
import deletePost from '../lib/deletePost';
import DeleteModal from '../components/DeleteModal';

export type HomeScreenNavigationProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<TabStackParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const scheme = useColorScheme();
  // const {posts} = useFetchPostListener(client);
  const [posts, setPosts] = useState<Post[]>([]);
  const isFocused = useIsFocused();
  const [showDeleteBox, setShowDeleteBox] = useState<boolean>(false);
  const [postIdForDeletion, setPostIdForDeletion] = useState<string>('');

  const fetchPosts = async () => {
    const result = await getPosts(client);
    setPosts(result);
  };

  useEffect(() => {
    if (isFocused) {
      fetchPosts();
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Posts',
    });
  }, [navigation, scheme]);

  const handleDeletePost = async () => {
    if (postIdForDeletion) {
      let newPosts = posts;
      const postIndex = newPosts.findIndex(
        post => post._id === postIdForDeletion,
      );
      newPosts = [
        ...newPosts.slice(0, postIndex),
        ...newPosts.slice(postIndex + 1),
      ];
      setPosts(newPosts);
      setShowDeleteBox(false);
      await deletePost(postIdForDeletion);
    }
  };

  const displayDeleteModal = (postId: string) => {
    setPostIdForDeletion(postId);
    setShowDeleteBox(true);
  };

  const renderPost = ({item}: any) => (
    <PostComponent
      key={item._id}
      post={item}
      displayDeleteModal={displayDeleteModal}
    />
  );

  if (posts?.length === 0)
    return (
      <ActivityIndicator
        className="min-h-full bg-white relative dark:bg-[#151515]"
        size="large"
        color="#9e6969"
      />
    );

  return (
    <View className="bg-white min-h-full dark:bg-[#151515]">
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={scheme === 'dark' ? '#151515' : 'white'}
      />

      <FlatList
        data={posts}
        renderItem={renderPost}
        // @ts-ignore
        keyExtractor={item => item._id}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: 15}}
      />

      <DeleteModal
        showDeleteBox={showDeleteBox}
        onBackDropPress={() => setShowDeleteBox(false)}
        handleDeletePost={handleDeletePost}
      />
    </View>
  );
};

export default HomeScreen;
