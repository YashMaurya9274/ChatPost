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
import {RootStackParamList} from '../components/Navigator';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

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
    const result = auth().signInWithCredential(googleCredential);

    result.then(re => console.log(re));
  };

  return (
    <View
      className={`flex-1 ${
        scheme === 'dark' ? 'bg-[#151515]' : 'bg-white'
      } items-center justify-center space-y-5`}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={scheme === 'dark' ? '#151515' : 'white'}
      />
      <Text className="text-[#9e6969] text-3xl font-semibold dark:text-[#ac6969]">
        Welcome to ChatPost
      </Text>
      <TouchableOpacity
        disabled={disableLoginButton}
        onPress={signInWithGoogle}
        className="bg-[#9e6969] p-3 w-1/2 rounded-lg"
        activeOpacity={0.3}>
        {disableLoginButton ? (
          <ActivityIndicator size={28} color="#ececec" />
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
