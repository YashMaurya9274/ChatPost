import {useColorScheme} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import ChatsScreen from '../screens/ChatsScreen';
import MessageScreen from '../screens/MessageScreen';
import LoginScreen from '../screens/LoginScreen';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {selectUser, setUser} from '../slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import TabNavigator from './TabNavigator';
import UserProfileScreen from '../screens/UserProfileScreen';
import storeUser from '../lib/storeUser';
import CommentsScreen from '../screens/CommentsScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FriendRequestScreen from '../screens/FriendRequestScreen';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Chats: undefined;
  Messages: {
    chatId?: string;
    messages: Message[];
    friendId: string;
    friendImage: string;
    friendName: string;
    notSeenCount: number;
  };
  UserProfile: {
    userId: string;
    fromFriendRequestsScreen?: boolean;
  };
  Comments: {
    postId: string;
    postComments: StoreComment[];
  };
  FriendRequest: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  const scheme = useColorScheme();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const globalScreenOptions: NativeStackNavigationOptions = {
    headerStyle: {backgroundColor: scheme === 'dark' ? '#151515' : 'white'},
    headerTitleStyle: {color: scheme === 'dark' ? 'white' : 'black'},
    headerTintColor: scheme === 'dark' ? 'white' : 'black',
    headerShadowVisible: false,
    // animationEnabled: false,
  };

  // Handle user state changes
  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    dispatch(setUser(user));
    if (user) storeUser(user);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={globalScreenOptions}>
          {!user ? (
            <RootStack.Screen name="Login" component={LoginScreen} />
          ) : (
            <>
              <RootStack.Group>
                <RootStack.Screen name="Main" component={TabNavigator} />
              </RootStack.Group>
              <RootStack.Screen
                name="UserProfile"
                component={UserProfileScreen}
              />
              <RootStack.Screen name="Chats" component={ChatsScreen} />
              <RootStack.Screen name="Messages" component={MessageScreen} />
              <RootStack.Screen
                options={{
                  animation: 'slide_from_bottom',
                }}
                name="Comments"
                component={CommentsScreen}
              />
              <RootStack.Screen
                name="FriendRequest"
                component={FriendRequestScreen}
              />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
