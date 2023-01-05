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
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  return (
    <View className="bg-white min-h-full dark:bg-[#151515]">
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('UserProfile', {
            userInfo: {
              user: {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
              },
              userPosts: [
                {
                  id: '1',
                  title: 'This is DEMO POST',
                  subTitle:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                  imageUrl:
                    'https://cdn.vox-cdn.com/thumbor/IDuU1a0FYBrTb_X0tt5gCyTeALU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/10164247/BlackPanther596d2f04d1540_2040.jpg',
                  timestamp: Date.now(),
                  userImage:
                    'https://cdn.vox-cdn.com/thumbor/IDuU1a0FYBrTb_X0tt5gCyTeALU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/10164247/BlackPanther596d2f04d1540_2040.jpg',
                  userName: 'Black Panther',
                },
              ],
            },
          })
        }
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
          <Text className="text-gray-400 dark:text-gray-500 ">
            {user?.email}
          </Text>
        </View>
      </TouchableOpacity>

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
