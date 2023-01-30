import {SanityClient} from '@sanity/client';
import groq from 'groq';
import {useEffect, useState} from 'react';
import {Post, UserData} from '../types/typings';

const useFetchUserDataListener = (client: SanityClient, userId: string) => {
  const [userData, setUserData] = useState<UserData>();

  //Listen for data changes in Sanity
  const fetchUserDataQuery = groq`
    *[_type == 'users' && _id == '${userId}'] {
      ...,
      "posts": *[_type == "posts" && references(^._id)] | order(_createdAt desc) {
        ...,
        user->
      }
    }
    `;
  const params = {};

  fetchPosts();

  useEffect(() => {
    const subscription = client
      .listen(fetchUserDataQuery, params)
      .subscribe((resUserData: any) => {
        setUserData(resUserData[0]);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [client]);

  function fetchPosts() {
    client.fetch(fetchUserDataQuery, params).then(resUserData => {
      setUserData(resUserData[0]);
    });
  }

  return {userData, setUserData};
};

export default useFetchUserDataListener;
