import {TouchableOpacity, Text, Image, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../slices/userSlice';
import {client} from '../lib/client';
import getFriendsStatus from '../lib/getFriendsStatus';
import getFriendRequestReceivingStatus from '../lib/getFriendRequestReceivingStatus';
import getFriendRequestSentStatus from '../lib/getFriendRequestSentStatus';
import {FRIEND_REQUEST_STATUS} from '../enums';
import {Skeleton} from '@rneui/themed';

type Props = {
  user: Friend;
  navigateToUserProfile: (userId: string) => void;
  getFriendRequestMessage: (
    requestStatus: FRIEND_REQUEST_STATUS | null,
  ) =>
    | FRIEND_REQUEST_STATUS.FRIEND_REQUEST_SENT
    | FRIEND_REQUEST_STATUS.ADD_FRIEND
    | FRIEND_REQUEST_STATUS.UNFRIEND
    | undefined;
  initiateRequestProcess: (
    reqMessage: FRIEND_REQUEST_STATUS | null,
    currentUserId: string,
    otherUserId: string,
  ) => Promise<void>;
};

const RandomUserComponent = ({
  user: randomUser,
  navigateToUserProfile,
  getFriendRequestMessage,
  initiateRequestProcess,
}: Props) => {
  const user = useSelector(selectUser);
  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FRIEND_REQUEST_STATUS | null>(null);

  useEffect(() => {
    fetchFriendRequestStatus();
  }, []);

  const fetchFriendRequestStatus = async () => {
    const friendsStatus = await getFriendsStatus(
      client,
      user.uid,
      randomUser._id!,
    );
    if (friendsStatus) {
      setFriendRequestStatus(friendsStatus);
    } else {
      const friendRequestReceivedStatus = await getFriendRequestReceivingStatus(
        client,
        user.uid,
        randomUser._id!,
      );
      if (friendRequestReceivedStatus) {
        setFriendRequestStatus(friendRequestReceivedStatus);
      } else {
        const friendRequestSentStatus = await getFriendRequestSentStatus(
          client,
          user.uid,
          randomUser._id!,
        );
        setFriendRequestStatus(friendRequestSentStatus);
      }
    }
  };

  const handleAddFriend = async () => {
    const reqMessage = friendRequestStatus;

    const res = getFriendRequestMessage(friendRequestStatus);
    setFriendRequestStatus(res!);
    initiateRequestProcess(reqMessage, user.uid, randomUser._id!);
  };

  if (!friendRequestStatus) {
    return (
      <View>
        <Skeleton
          // LinearGradientComponent={LinearGradient}
          animation="wave"
          style={{borderRadius: 10, marginHorizontal: 8}}
          width={144}
          height={180}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => navigateToUserProfile(randomUser._id!)}
      key={randomUser._id}
      style={{
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
      }}
      className="w-36 mx-2 rounded-b-lg rounded-t-lg bg-white dark:bg-[#282828]">
      <Image
        source={{uri: randomUser.photoURL}}
        resizeMode="stretch"
        className="h-24 w-full rounded-t-lg"
      />
      <Text className="text-[15px] mx-1 text-gray-600 dark:text-gray-200 text-center mt-2">
        {randomUser.displayName}
      </Text>

      <TouchableOpacity
        className="bg-[#9e6969] p-2 mx-auto rounded-md m-2 mt-3"
        onPress={handleAddFriend}>
        <Text className="text-center font-bold text-white">
          {friendRequestStatus}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default RandomUserComponent;
