import {useColorScheme} from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Message, UserData} from '../types/typings';
import {MenuProvider} from 'react-native-popup-menu';
import ChatsScreen from '../screens/ChatsScreen';
import MessageScreen from '../screens/MessageScreen';
import LoginScreen from '../screens/LoginScreen';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {selectUser, setUser} from '../slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import TabNavigator from './TabNavigator';
import UserProfileScreen from '../screens/UserProfileScreen';
import {
  NEXT_PUBLIC_SANITY_API_VERSION,
  NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_PROJECT_ID,
  SANITY_API_TOKEN,
} from '@env';

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

    const url = `https://${NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${NEXT_PUBLIC_SANITY_API_VERSION}/data/mutate/${NEXT_PUBLIC_SANITY_DATASET}`;

    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${SANITY_API_TOKEN}`,
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
