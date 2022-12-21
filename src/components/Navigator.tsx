import {useColorScheme} from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import {Message, UserInfo} from '../../typings';
import {MenuProvider} from 'react-native-popup-menu';
import ChatsScreen from '../screens/ChatsScreen';
import MessageScreen from '../screens/MessageScreen';
import LoginScreen from '../screens/LoginScreen';
import auth from '@react-native-firebase/auth';
import {selectUser, setUser} from '../slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  UserProfile: {userInfo: UserInfo};
  Chats: undefined;
  Messages: {messages: Message[]};
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  const scheme = useColorScheme();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const globalScreenOptions = {
    headerStyle: {backgroundColor: scheme === 'dark' ? '#151515' : 'white'},
    headerTitleStyle: {color: scheme === 'dark' ? 'white' : 'black'},
    headerTintColor: scheme === 'dark' ? 'white' : 'black',
    headerShadowVisible: false,
    // animationEnabled: false,
  };

  // Handle user state changes
  const onAuthStateChanged = (user: any) => {
    dispatch(setUser(user));
  };

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <MenuProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={globalScreenOptions}>
          {!user ? (
            <RootStack.Screen name="Login" component={LoginScreen} />
          ) : (
            <>
              <RootStack.Screen name="Home" component={HomeScreen} />
              <RootStack.Screen
                name="UserProfile"
                component={UserProfileScreen}
              />
              <RootStack.Screen name="Chats" component={ChatsScreen} />
              <RootStack.Screen name="Messages" component={MessageScreen} />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
