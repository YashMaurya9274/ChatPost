import {
  View,
  StatusBar,
  useColorScheme,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
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
import {Overlay} from '@rneui/themed';
import deletePost from '../lib/deletePost';

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

      <Overlay
        overlayStyle={{
          backgroundColor: scheme === 'dark' ? '#262626' : '#ebedef',
          paddingHorizontal: 30,
          paddingVertical: 20,
          width: 300,
          borderRadius: 10,
        }}
        onBackdropPress={() => setShowDeleteBox(false)}
        isVisible={showDeleteBox}
        animationType="fade">
        <Text className="text-gray-500 dark:text-gray-400 font-semibold text-lg mb-4">
          Post will be permanently deleted.
        </Text>
        <Text className="text-gray-500 text-base dark:text-gray-400 mb-4">
          Are you sure you want to delete it?
        </Text>
        <View className="flex flex-row justify-evenly space-x-4 items-center">
          <TouchableOpacity
            className="bg-[#FF5959] w-24 items-center rounded-lg px-3 py-2"
            onPress={handleDeletePost}>
            <Text className="text-white">Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border border-[#FF5959] w-24 items-center rounded-lg px-3 py-2"
            onPress={() => setShowDeleteBox(false)}>
            <Text className="text-[#FF5959]">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </View>
  );
};

export default HomeScreen;
