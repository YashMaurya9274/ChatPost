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
import CreatePostScreen from '../screens/CreatePostScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileOptionsScreen from '../screens/ProfileOptionsScreen';
import {
  selectFriendRequests,
  setFriendRequests,
} from '../slices/friendRequestsSlice';
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
  'Chats',
  'FriendRequest'
>;

const TabNavigator = () => {
  const navigation = useNavigation<TabNavigatorNavigationProp>();
  const noOfMessages = 99;
  const user = useSelector(selectUser);
  const scheme = useColorScheme();
  const dispatch = useDispatch();
  const friendRequests = useSelector(selectFriendRequests);
  const isFocused = useIsFocused();

  const fetchFriendRequests = async () => {
    const res = await getFriendsRequests(client, user.uid);
    dispatch(setFriendRequests(res));
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
            <Text style={styles.iconTextStyle}>{noOfMessages}</Text>
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
  }, [navigation, scheme, friendRequests]);

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
