import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import ImageLinks from '../assets/images';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {profileOptions} from '../lib/options';
import ProfileOptionComponent from '../components/ProfileOptionComponent';
import {PROFILE_OPTIONS} from '../enums';
import Share, {ShareOptions} from 'react-native-share';
import {appName, appURL} from '../constants';

export type ProfileOptionsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UserProfile'
>;

const ProfileOptionsScreen = () => {
  const user = useSelector(selectUser);
  const navigation = useNavigation<ProfileOptionsScreenNavigationProp>();
  const scheme = useColorScheme();

  const handleSignOut = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    auth().signOut();
  };

  const getUserData = async () => {
    navigation.navigate('UserProfile', {
      userId: user.uid,
    });
  };

  const inviteFriends = async () => {
    const shareOptions: ShareOptions = {
      title: 'App Invite',
      message: `Hi there, I'm inviting you to ${appName} \nClick on this URL to download the app - `,
      url: appURL,
      subject: `${appName} App Invite`,
      failOnCancel: true,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
    } catch (err) {
      console.log('INVITE ERROR', err);
    }
  };

  const handleNavigation = (title: string) => {
    switch (title) {
      case PROFILE_OPTIONS.MANAGE_SENT_REQUESTS:
        navigation.navigate('ManageSentRequests');
        break;
      case PROFILE_OPTIONS.INVITE_YOUR_FRIENDS:
        inviteFriends();
        break;
      case PROFILE_OPTIONS.ABOUT:
        navigation.navigate('ManageSentRequests');
        break;
    }
  };

  return (
    <View className="bg-white min-h-full dark:bg-[#151515]">
      <TouchableOpacity
        onPress={getUserData}
        activeOpacity={0.4}
        className="flex flex-row items-center space-x-3 p-3">
        <Image
          style={{height: 40, width: 40}}
          source={{uri: user?.photoURL}}
          className="rounded-lg"
        />
        <View className="w-[70%]">
          <Text className="text-gray-600 dark:text-gray-300 text-lg">
            {user?.displayName}
          </Text>
          <Text className="text-gray-400 dark:text-gray-500">
            {user?.email}
          </Text>
        </View>
      </TouchableOpacity>

      <View className="bg-gray-200 dark:bg-[#323232] mx-auto w-[95%] mt-1 h-[1px] mb-2" />

      <View className="flex">
        {profileOptions.map((profileOption, index) => (
          <ProfileOptionComponent
            key={index}
            title={profileOption.title}
            imageSource={profileOption.imageSource}
            handleNavigation={handleNavigation}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        activeOpacity={0.3}
        className="flex flex-row items-center space-x-3 px-10 py-2 rounded-lg mx-auto bg-gray-200 dark:bg-gray-800 mt-auto mb-20">
        <Image
          source={
            scheme === 'dark'
              ? ImageLinks.logoutIcon.logoutDarkMode
              : ImageLinks.logoutIcon.logoutLightMode
          }
          style={{height: 16, width: 16}}
        />
        <Text className="text-base text-gray-500 font-bold dark:text-[#bebebe]">
          Log Out
        </Text>
      </TouchableOpacity>
      {/* <Text className="text-base text-[#bb9090]">MADE IN INDIA</Text> */}
    </View>
  );
};

export default ProfileOptionsScreen;
