import groq from "groq";
import { client } from "./client";

const fetchPosts = async () => {
    const query = groq`
    *[_type == 'posts'] | order(_createdAt desc)  {
      ...,
      user->,
    }
  `;

    const res = await client.fetch(query);
    return res
  };

  export default fetchPosts