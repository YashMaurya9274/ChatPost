import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {COLOR_CODE} from '../enums';

export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

GoogleSignin.configure({
  webClientId:
    '1059564578399-nlgbvrpgobs8731jbm566r3s7f5crlfs.apps.googleusercontent.com',
});

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const scheme = useColorScheme();
  const [disableLoginButton, setDisableLoginButton] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const signInWithGoogle = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    if (googleCredential) setDisableLoginButton(true);

    // Sign-in the user with the credential
    auth().signInWithCredential(googleCredential);
  };

  return (
    <View
      className={`flex-1 ${
        scheme === 'dark' ? `bg-[${COLOR_CODE.BLACK_BACKGROUND}]` : 'bg-white'
      } items-center justify-center space-y-5`}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={
          scheme === 'dark' ? `${COLOR_CODE.BLACK_BACKGROUND}` : 'white'
        }
      />
      <Text
        className={`text-[${COLOR_CODE.BROWN_3}] text-3xl font-semibold dark:text-[${COLOR_CODE.BROWN_2}]`}>
        Welcome to ChatPost
      </Text>
      <TouchableOpacity
        disabled={disableLoginButton}
        onPress={signInWithGoogle}
        className={`bg-[${COLOR_CODE.BROWN_3}] p-3 w-1/2 rounded-lg`}
        activeOpacity={0.3}>
        {disableLoginButton ? (
          <ActivityIndicator size={28} color={COLOR_CODE.GREY_1} />
        ) : (
          <Text className="text-xl text-white text-center">
            Login With Google
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
