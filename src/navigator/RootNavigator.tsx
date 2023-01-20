import {useColorScheme} from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Message, UserData} from '../../typings';
import {MenuProvider} from 'react-native-popup-menu';
import ChatsScreen from '../screens/ChatsScreen';
import MessageScreen from '../screens/MessageScreen';
import LoginScreen from '../screens/LoginScreen';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {selectUser, setUser} from '../slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import TabNavigator from './TabNavigator';
import UserProfileScreen from '../screens/UserProfileScreen';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Chats: undefined;
  Messages: {messages: Message[]};
  UserProfile: {userData: UserData};
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
  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    dispatch(setUser(user));

    const mutations = [
      {
        createIfNotExists: {
          _type: 'users',
          _id: user?.uid!,
          displayName: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL,
        },
      },
    ];

    const url = `https://sg8behyd.api.sanity.io/v2023-01-19/data/mutate/production`;

    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer skNUqVNIS3w1VQ8CH5CCG4aQHNeKqtZrkrk6ezIEJ2FlCKyJSQloUJ0SqXp8N1H2q5sWT8YhF9jmM0MzZgwKDjbT5uwfqqeeLBIUaHSY2bp8OHv7CKyDvu8iPrlfaK5bowNHvQyI86QmlaO12cYPWF9RGrZUIbaxyPLmXDyNk1d9JaHFDIET`,
      },
      body: JSON.stringify({mutations}),
    });
    const result = await response.json();
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
              <RootStack.Group>
                <RootStack.Screen name="Main" component={TabNavigator} />
              </RootStack.Group>
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
