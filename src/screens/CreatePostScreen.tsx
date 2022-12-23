import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import ImageLinks from '../assets/images';

const CreatePostScreen = () => {
  const scheme = useColorScheme();
  const [image, setImage] = useState();

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
                  uri: 'https://cdn.vox-cdn.com/thumbor/IDuU1a0FYBrTb_X0tt5gCyTeALU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/10164247/BlackPanther596d2f04d1540_2040.jpg',
                }}
              />
            </TouchableOpacity>
            <View className="w-[70%]">
              <Text className="text-gray-700 text-base font-bold w-full dark:text-gray-200">
                Tony Stark
              </Text>
            </View>
          </View>

          {/* MIDDLE PART */}
          <View className="px-3 mt-3 mb-5 space-y-2">
            <TextInput
              //   value={message}
              //   onChangeText={text => setMessage(text)}
              className="flex-1 text-lg font-bold placeholder:text-[16px] bg-gray-300 text-gray-600 max-h-20 rounded-lg p-2 dark:bg-[#444444] dark:text-gray-300"
              placeholder="Enter Title Here...."
              placeholderTextColor="gray"
              maxLength={70}
            />
            <TextInput
              className="flex-1 text-sm  bg-gray-300 text-gray-500 max-h-48 rounded-lg p-2 dark:bg-[#444444] dark:text-gray-400"
              placeholder="Enter Description here...."
              placeholderTextColor="gray"
              multiline
              textAlignVertical="center"
            />
          </View>

          {/* IMAGE PART */}
          {image ? (
            <Image
              resizeMode="stretch"
              className="h-60"
              source={{
                uri: 'https://cdn.vox-cdn.com/thumbor/IDuU1a0FYBrTb_X0tt5gCyTeALU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/10164247/BlackPanther596d2f04d1540_2040.jpg',
              }}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.5}
              className="items-center justify-center bg-gray-300 h-60 w-full dark:bg-[#444444]">
              <Text className="text-gray-500 dark:text-gray-400 text-xl">
                Upload Image
              </Text>
            </TouchableOpacity>
          )}

          {/* BOTTOM PART */}
          <View className="flex flex-row justify-evenly items-center border-t border-gray-400 dark:border-gray-600">
            {/* LIKE */}
            <View className="flex flex-row items-center space-x-2 py-3">
              <Image
                source={
                  scheme === 'dark'
                    ? ImageLinks.like.likeOutline
                    : ImageLinks.like.likeOutline
                }
              />
              <Text className="text-gray-500 dark:text-gray-400 font-bold">
                Like
              </Text>
            </View>

            {/* SEPARATOR */}
            <View className="w-[1px] h-full bg-gray-400 dark:bg-gray-600" />

            {/* COMMENT */}
            <View className="flex flex-row items-center space-x-2 py-3">
              <Image source={ImageLinks.commentsSolid} />
              <Text className="text-gray-500 dark:text-gray-400 font-semibold">
                Comments
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.2}
          className="bg-[#9e6969] dark:bg-[#694242] p-2 w-[70%] rounded-md mx-auto mt-3">
          <Text className="text-center font-bold text-white">POST</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreatePostScreen;
