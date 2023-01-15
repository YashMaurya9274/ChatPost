import {
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Text,
  useColorScheme,
  FlatList,
} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {Post} from '../../typings';
import PostComponent from '../components/PostComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {TabStackParamList} from '../navigator/TabNavigator';

export type HomeScreenNavigationProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<TabStackParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const posts: Post[] = [
  {
    id: '1',
    title: 'This is DEMO POST',
    subTitle:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    timestamp: Date.now(),
    userImage:
      'https://cdn.vox-cdn.com/thumbor/IDuU1a0FYBrTb_X0tt5gCyTeALU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/10164247/BlackPanther596d2f04d1540_2040.jpg',
    userName: 'Black Panther',
  },
  {
    id: '2',
    title: 'This is DEMO POST',
    subTitle:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500ssheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    imageUrl:
      'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/05/02/Pictures/_3ffd628e-4dcc-11e8-a9dc-143d85bacf22.jpg',
    timestamp: Date.now(),
    userImage:
      'https://superstarsbio.com/wp-content/uploads/2019/04/Robert-Downey-Jr.-Smile.jpg',
    userName: 'Robert Downey Jr.',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const scheme = useColorScheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Posts',
    });
  }, [navigation, scheme]);

  const renderPost = ({item}: any) => (
    <PostComponent key={item.id} post={item} />
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
        keyExtractor={item => item.id}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: 15}}
      />
    </View>
  );
};

export default HomeScreen;
