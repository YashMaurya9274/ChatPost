import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import ImageLinks from '../assets/images';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import getLikedUsersInfo from '../lib/getLikedUsersInfo';
import {RootStackParamList} from '../navigator/RootNavigator';
import {client} from '../lib/client';
import UserComponent from '../components/UserComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type LikesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Likes'
>;

type LikesScreenRouteProp = RouteProp<RootStackParamList, 'Likes'>;

const LikesScreen = () => {
  const [userLikes, setUserLikes] = useState<LikedUser[]>([]);
  const navigation = useNavigation<LikesScreenNavigationProp>();
  const {
    params: {postId, likesLength},
  } = useRoute<LikesScreenRouteProp>();
  const isFocused = useIsFocused();
  const scheme = useColorScheme();

  const fetchUserLikesInfo = async () => {
    const result = await getLikedUsersInfo(client, postId);
    setUserLikes(result[0].likes);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View className="flex flex-row space-x-2 items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={ImageLinks.arrow.arrowLeft}
              className="h-5 w-5"
              style={{tintColor: scheme === 'dark' ? 'white' : 'black'}}
            />
          </TouchableOpacity>
          <View className="flex flex-row items-center px-4 space-x-2">
            <View className="bg-[#aa6e6e] dark:bg-[#8b6060] p-[6px] rounded-full">
              <Image
                className="h-5 w-5"
                source={ImageLinks.like.likeSolidDarkMode}
                style={{tintColor: 'whitesmoke'}}
              />
            </View>
            <Text className="text-gray-500 text-base dark:text-gray-400 font-semibold">
              {likesLength} {likesLength > 1 ? 'likes' : 'like'}
            </Text>
          </View>
        </View>
      ),
    });
  }, [scheme]);

  useEffect(() => {
    if (isFocused) {
      fetchUserLikesInfo();
    }
  }, [isFocused]);

  const navigateToUserProfile = (userId: string) => {
    navigation.push('UserProfile', {
      userId,
    });
  };

  const renderUserLikes = ({item, index}: any) => (
    <UserComponent
      key={index}
      user={item}
      navigateToUserProfile={navigateToUserProfile}
      userImageHeight={35}
      userImageWidth={35}
    />
  );

  const renderLikesLoader = () => (
    <View className="bg-white h-screen flex-1 justify-center items-center dark:bg-[#151515]">
      <ActivityIndicator size="large" color="#9e6969" />
    </View>
  );

  return (
    <View className="bg-white flex-1 dark:bg-[#151515]">
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={scheme === 'dark' ? '#151515' : 'white'}
      />
      <View className="bg-gray-200 dark:bg-[#323232] mx-auto w-[95%] mt-3 h-[1px] mb-3" />
      <FlatList
        data={userLikes}
        renderItem={renderUserLikes}
        ListEmptyComponent={renderLikesLoader}
      />
    </View>
  );
};

export default LikesScreen;
