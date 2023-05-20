import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ImageLinks from '../assets/images';
import {client} from '../lib/client';
import getFriendsRequests from '../lib/getFriendRequests';
import getTotalNewUnseenChats from '../lib/getTotalNewUnseenChats';
import CreatePostScreen from '../screens/CreatePostScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileOptionsScreen from '../screens/ProfileOptionsScreen';
import {
  selectFriendRequests,
  setFriendRequests,
} from '../slices/friendRequestsSlice';
import {selectUser} from '../slices/userSlice';
import {RootStackParamList} from './RootNavigator';
import {appName} from '../constants';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export type TabStackParamList = {
  Home: undefined;
  ['Create Post']: undefined;
  Options: undefined;
};

const Tab = createMaterialTopTabNavigator<TabStackParamList>();

export type TabNavigatorNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Chats',
  'FriendRequest'
>;

const TabNavigator = () => {
  const navigation = useNavigation<TabNavigatorNavigationProp>();
  const user = useSelector(selectUser);
  const scheme = useColorScheme();
  const dispatch = useDispatch();
  const friendRequests = useSelector(selectFriendRequests);
  const [totalNewUnseenChats, setTotalNewUnseenChats] = useState<number>(0);
  const isFocused = useIsFocused();

  const fetchFriendRequests = async () => {
    const res = await getFriendsRequests(client, user.uid);
    dispatch(setFriendRequests(res));
  };

  const fetchTotalNewUnseenChats = async () => {
    const result = await getTotalNewUnseenChats(client, user.uid);
    setTotalNewUnseenChats(result);
  };

  useEffect(() => {
    if (isFocused) {
      fetchFriendRequests();
      fetchTotalNewUnseenChats();
    }
  }, [isFocused]);

  const dynamicLinkingRouting = (link: any) => {
    if (link) {
      // Handle dynamic link inside your own application
      if (link.url.includes('https://chatpost.com/profile')) {
        const url: string = link.url;
        const profileId = url.slice(url.lastIndexOf('/') + 1);
        navigation.navigate('UserProfile', {
          userId: profileId,
        });
      } else if (link.url.includes('https://chatpost.com/post')) {
        const url: string = link.url;
        const postId = url.slice(url.lastIndexOf('/') + 1);
        navigation.navigate('Post', {
          postId,
        });
      }
    }
  };

  // LISTEN LINK WHEN APP IS IN BACKGROUND / KILLED / QUIT
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        dynamicLinkingRouting(link);
      });
  }, []);

  const handleDynamicLink = (link: any) => {
    dynamicLinkingRouting(link);
  };

  // LISTEN LINK WHEN APP IS IN FOREGROUND
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  // ChatPost, ConfabPost, PingPost, CapTM -> Chat & Post - The Messenger
  useLayoutEffect(() => {
    navigation.setOptions({
      title: appName,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 23,
        color: scheme === 'dark' ? '#bb9090' : '#9e6969',
      },
      headerRight: () => (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('FriendRequest')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}>
            {friendRequests?.length! > 0 && friendRequests !== null && (
              <Text style={styles.iconTextStyle}>{friendRequests?.length}</Text>
            )}
            <Image
              style={{
                height: 28,
                width: 28,
                position: 'relative',
                marginRight: 5,
                tintColor: scheme === 'dark' ? '#bb9090' : '#9e6969',
              }}
              source={ImageLinks.addFriend}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('Chats')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: -5,
            }}>
            {totalNewUnseenChats > 0 && (
              <Text style={styles.iconTextStyle}>{totalNewUnseenChats}</Text>
            )}
            <Image
              style={{
                height: 28,
                width: 28,
                position: 'relative',
                marginRight: 5,
                tintColor: scheme === 'dark' ? '#bb9090' : '#9e6969',
              }}
              source={ImageLinks.messages.messagesOutlineLightMode}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, scheme, friendRequests, totalNewUnseenChats]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: scheme === 'dark' ? '#151515' : 'white',
        },
        tabBarIndicatorStyle: {
          backgroundColor: scheme === 'dark' ? '#bb9090' : '#9e6969',
        },
        tabBarActiveTintColor: scheme === 'dark' ? '#bb9090' : '#9e6969',
        tabBarInactiveTintColor: scheme === 'dark' ? '#9e6969' : '#bb9090',
        tabBarLabelStyle: {fontSize: 14, fontWeight: '600'},
        // tabBarIcon: ({focused, color}) => {
        //   if (route.name === 'Home') {
        //     return <Text>Home</Text>;
        //   } else if (route.name === 'UserProfile') {
        //     return <Text>Profile</Text>;
        //   }
        // },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create Post" component={CreatePostScreen} />
      <Tab.Screen name="Options" component={ProfileOptionsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  iconTextStyle: {
    padding: 3,
    textAlign: 'center',
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: '#9e6969',
    fontSize: 10,
    color: 'white',
    zIndex: 10,
    height: 20,
    minWidth: 20,
    width: 'auto',
    right: 0,
    bottom: 15,
    fontWeight: '500',
  },
});
