import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Animated,
} from 'react-native';
import React, {useRef, useState} from 'react';
import ImageLinks from '../assets/images';
import {
  Asset,
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Video from 'react-native-video';
import {selectUser} from '../slices/userSlice';
import {useSelector} from 'react-redux';
import {client} from '../lib/client';
import storePost from '../lib/storePost';
import {SanityImageAssetDocument} from '@sanity/client';

const CreatePostScreen = () => {
  const scheme = useColorScheme();
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [media, setMedia] = useState<Asset>();
  const [muteVideo, setMuteVideo] = useState(false);
  const [pauseVideo, setPauseVideo] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const user = useSelector(selectUser);

  const uploadMedia = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      maxHeight: 350,
      quality: 0.7,
      // videoQuality: 'medium',
      durationLimit: 60,
    };

    const result = await launchImageLibrary(options);
    if (result.assets) {
      setMedia(result.assets[0]);
      // console.log(result.assets[0]?.type);
      // if (result.assets[0]?.type === 'image/jpeg') {
      //   setMedia(result.assets[0]);
      // }
      // if (result.assets[0]?.type?.includes("video")) {
      //   setVideo(result.assets[0])
    }
  };

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 0 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 1.1 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1100,
      useNativeDriver: true,
    }).start();
  };

  const playPauseVideoFunction = () => {
    if (media?.type?.includes('video')) {
      setPauseVideo(!pauseVideo);
      if (pauseVideo) fadeOut();
      else fadeIn();
    }
  };

  const handlePost = async () => {
    if (!title) return;

    if (media) {
      const img = await fetch(media?.uri!);
      const bytes = await img.blob();
      let tempImgAsset: SanityImageAssetDocument;
      client.assets
        .upload('image', bytes, {
          filename: media?.fileName,
        })
        .then(imageAsset => (tempImgAsset = imageAsset))
        .then(async () => {
          const post: StorePost = {
            _type: 'posts',
            title: title,
            subTitle: subTitle,
            imageUrl: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: tempImgAsset._id,
              },
            },
            user: {
              _type: 'reference',
              _ref: user.uid,
            },
          };

          await storePost(post).then(() => {
            setTitle('');
            setMedia(undefined);
            setSubTitle('');
          });
        });
    } else {
      const post: StorePost = {
        _type: 'posts',
        title: title,
        subTitle: subTitle,
        user: {
          _type: 'reference',
          _ref: user.uid,
        },
      };

      await storePost(post).then(() => {
        setTitle('');
        setSubTitle('');
      });
    }
  };

  return (
    <View className="bg-white min-h-full dark:bg-[#151515]">
      <ScrollView contentContainerStyle={{paddingBottom: 15}}>
        <View className="rounded-lg shadow-slate-900 shadow-2xl bg-[#E9E9E9] mx-4 mt-4 dark:bg-[#262626]">
          {/* UPPER PART */}
          <View className="flex flex-row items-center space-x-3 px-3 mt-3">
            <TouchableOpacity activeOpacity={0.5}>
              <Image
                className="h-10 w-10 rounded-full"
                source={{
                  uri: user?.photoURL,
                }}
              />
            </TouchableOpacity>
            <View className="w-[70%]">
              <Text className="text-gray-700 text-base font-bold w-full dark:text-gray-200">
                {user?.displayName}
              </Text>
            </View>
          </View>

          {/* MIDDLE PART */}
          <View className="px-3 mt-3 mb-5 space-y-2">
            <TextInput
              value={title}
              onChangeText={text => setTitle(text)}
              className="flex-1 text-lg font-bold placeholder:text-[16px] bg-gray-300 text-gray-600 max-h-20 rounded-lg p-2 dark:bg-[#444444] dark:text-gray-300"
              placeholder="Enter Title Here...."
              placeholderTextColor="gray"
              maxLength={100}
            />
            <TextInput
              value={subTitle}
              onChangeText={text => setSubTitle(text)}
              className="flex-1 text-sm  bg-gray-300 text-gray-500 max-h-48 rounded-lg p-2 dark:bg-[#444444] dark:text-gray-400"
              placeholder="Enter Description here...."
              placeholderTextColor="gray"
              multiline
              textAlignVertical="center"
            />
          </View>

          {/* MEDIA PART */}
          {media ? (
            <TouchableOpacity
              onPress={playPauseVideoFunction}
              activeOpacity={1}>
              <TouchableOpacity
                onPress={uploadMedia}
                activeOpacity={0.3}
                className="bg-[#353535]/80 p-2 rounded-lg w-auto absolute z-10 right-5 top-5">
                <Image
                  className="relative"
                  style={{height: 20, width: 20}}
                  source={ImageLinks.reload}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMedia(undefined)}
                activeOpacity={0.3}
                className="bg-red-500/80 p-2 rounded-lg w-auto absolute z-10 left-5 top-5">
                <Image
                  className="relative"
                  style={{height: 20, width: 20}}
                  source={ImageLinks.cross}
                />
              </TouchableOpacity>
              {media.type?.includes('image') ? (
                <Image
                  resizeMode="cover"
                  className="h-[350px] w-full mx-auto"
                  source={{
                    uri: media.uri,
                  }}
                />
              ) : (
                <>
                  {/* PAUSE/PLAY ICON */}
                  {/* <Animated.View
                    style={{opacity: fadeAnim}}
                    className={`bg-[#353535]/80 p-3 bottom-5 left-5 rounded-full absolute z-10`}>
                    {pauseVideo ? (
                      <Image
                        style={{height: 30, width: 30}}
                        source={ImageLinks.playIcon}
                      />
                    ) : (
                      <Image
                        style={{height: 30, width: 30}}
                        source={ImageLinks.pauseIcon}
                      />
                    )}
                  </Animated.View> */}

                  {/* MUTE ICON */}
                  {/* <TouchableOpacity
                    onPress={() => setMuteVideo(!muteVideo)}
                    activeOpacity={0.3}
                    className="bg-[#353535]/80 p-[5px] right-5 bottom-5 rounded-full absolute z-10">
                    {muteVideo ? (
                      <Image
                        style={{height: 18, width: 18}}
                        source={ImageLinks.volume.volumeMute}
                      />
                    ) : (
                      <Image
                        style={{height: 18, width: 18}}
                        source={ImageLinks.volume.volumeUp}
                      />
                    )}
                  </TouchableOpacity>
                  <Video
                    source={{uri: media.uri}}
                    resizeMode="contain"
                    // @ts-ignore
                    className="relative h-[350px] w-full mx-auto"
                    muted={muteVideo}
                    paused={pauseVideo}
                    repeat
                  /> */}
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={!title}
              activeOpacity={0.5}
              onPress={uploadMedia}
              className="items-center justify-center bg-gray-300 mx-auto h-[350px] w-full dark:bg-[#444444]">
              <Text className="text-[#A5A5A5] dark:text-[#686868] text-xl">
                Upload Image
              </Text>
            </TouchableOpacity>
          )}

          {/* BOTTOM PART */}
          <View className="flex flex-row justify-evenly items-center border-t border-gray-300 dark:border-[#383838]">
            {/* LIKE */}
            <View className="flex flex-row items-center space-x-2 py-[10px]">
              <Image
                className="h-4 w-4"
                source={
                  scheme === 'dark'
                    ? ImageLinks.like.likeOutline
                    : ImageLinks.like.likeOutline
                }
              />
              <Text className="text-gray-500 text-xs dark:text-gray-400 font-bold">
                Like
              </Text>
            </View>

            {/* SEPARATOR */}
            <View className="w-[1px] h-full bg-gray-300 dark:bg-[#383838]" />

            {/* COMMENT */}
            <View className="flex flex-row items-center space-x-2 py-[10px]">
              <Image className="h-4 w-4" source={ImageLinks.commentsSolid} />
              <Text className="text-gray-500 text-xs dark:text-gray-400 font-semibold">
                Comments
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          disabled={!title}
          onPress={handlePost}
          activeOpacity={0.2}
          className="bg-[#9e6969] dark:bg-[#694242] p-2 w-[70%] rounded-md mx-auto mt-5">
          <Text className="text-center font-bold text-white">POST</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreatePostScreen;
