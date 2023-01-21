import groq from "groq";
import { client } from "./client";

const fetchUserData = async (userId: string) => {
    const fetchUserPostsQuery = groq`
    *[_type == 'users' && _id == '${userId}'] {
      ...,
      "posts": *[_type == "posts" && references(^._id)] {
        ...,
        user->
      }
    }
    `;

    const res = await client.fetch(fetchUserPostsQuery);
    return res[0]
  };

  export default fetchUserData