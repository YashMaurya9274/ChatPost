import {SanityClient} from '@sanity/client';
import groq from 'groq';
import {useEffect, useState} from 'react';
import {Post} from '../types/typings';

const useSanityListener = (client: SanityClient) => {
  const [posts, setPosts] = useState<Post[]>([]);

  //Listen for data changes in Sanity
  const query = groq`
    *[_type == 'posts'] | order(_createdAt desc)  {
      ...,
      user->,
    }
  `;
  const params = {};

  fetchPosts();

  useEffect(() => {
    const subscription = client
      .listen(query, params)
      .subscribe(newSanityPosts => {
        let sanityPost = newSanityPosts.result;
        let sanityPosts: any = [...posts, sanityPost];
        setPosts(sanityPosts);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [client]);

  function fetchPosts() {
    client.fetch(query, params).then(sanityPosts => {
      setPosts(sanityPosts);
    });
  }

  return {posts, setPosts};
};

export default useSanityListener;
