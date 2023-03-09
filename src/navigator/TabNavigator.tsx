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
} from 'react-native';
import {useSelector} from 'react-redux';
import ImageLinks from '../assets/images';
import {client} from '../lib/client';
import getFriendsRequests from '../lib/getFriendRequests';
import CreatePostScreen from '../screens/CreatePostScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileOptionsScreen from '../screens/ProfileOptionsScreen';
import {selectUser} from '../slices/userSlice';
import {RootStackParamList} from './RootNavigator';

export type TabStackParamList = {
  Home: undefined;
  ['Create Post']: undefined;
  Options: undefined;
};

const Tab = createMaterialTopTabNavigator<TabStackParamList>();

export type TabNavigatorNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Chats'
>;

const TabNavigator = () => {
  const navigation = useNavigation<TabNavigatorNavigationProp>();
  const noOfMessages = 99;
  const user = useSelector(selectUser);
  const scheme = useColorScheme();
  const [noOfFriendRequests, setNoOfFriendRequest] = useState<
    FriendRequest[] | null
  >(null);
  const isFocused = useIsFocused();

  const fetchFriendRequests = async () => {
    const res = await getFriendsRequests(client, user.uid);
    setNoOfFriendRequest(res);
  };

  useEffect(() => {
    if (isFocused) fetchFriendRequests();
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'ChatPost',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 23,
        color: scheme === 'dark' ? '#bb9090' : '#9e6969',
      },
      headerRight: () => (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity
            activeOpacity={0.5}
            // onPress={() => navigation.navigate('Chats')}
            // onPress={signOutWithGoogle}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}>
            {noOfFriendRequests?.length! > 0 && noOfFriendRequests !== null && (
              <Text
                style={{
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
                }}>
                {noOfFriendRequests?.length}
              </Text>
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
            // onPress={signOutWithGoogle}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: -5,
            }}>
            <Text
              style={{
                padding: 3,
                textAlign: 'center',
                borderRadius: 100,
                position: 'absolute',
                backgroundColor: '#9e6969',
                fontSize: 10,
                color: 'white',
                height: 20,
                minWidth: 20,
                width: 'auto',
                zIndex: 10,
                right: 0,
                bottom: 15,
                fontWeight: '500',
              }}>
              {noOfMessages}
            </Text>
            <Image
              style={{
                height: 28,
                width: 28,
                position: 'relative',
                marginRight: 5,
              }}
              source={
                scheme === 'dark'
                  ? ImageLinks.messages.messagesOutlineDarkMode
                  : ImageLinks.messages.messagesOutlineLightMode
              }
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, scheme, noOfFriendRequests]);

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
