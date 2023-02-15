import {SanityClient} from '@sanity/client';
import groq from 'groq';
import {useEffect, useState} from 'react';
import {Post} from '../types/typings';

const useFetchPostComments = (client: SanityClient, postId: string) => {
  const [comments, setComments] = useState<Post[]>([]);

  //Listen for data changes in Sanity
  const query = groq`
  *[_type == 'posts' && _id == '${postId}'] {
      ...,
      "postComments": *[_type == "comments" && post._ref == '${postId}'] | order(_createdAt desc) {
        ...,
        user->
      }
    }
  `;
  const params = {};

  fetchComments();

  //   useEffect(() => {
  //     const subscription = client
  //       .listen(query, params)
  //       .subscribe(newSanityComments => {
  //         console.log(newSanityComments.result);
  //         // let sanityComment = newSanityComments.result?.postComments;
  //         // let sanityComments: any = [...comments, sanityComment];
  //         // setComments(sanityComments);
  //       });

  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   }, [client]);

  function fetchComments() {
    client.fetch(query, params).then(sanityComments => {
      setComments(sanityComments[0].postComments);
    });
  }

  return {comments, setComments};
};

export default useFetchPostComments;
