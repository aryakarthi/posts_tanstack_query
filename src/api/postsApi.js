import axios from "axios";

// # axios method

const postsApi = axios.create({
  baseURL: "http://localhost:3000",
});

export const fetchPosts = async (page) => {
  const response = await postsApi.get(
    `/posts?_sort=-id&${page ? `_page=${page}&_per_page=5` : ""}`
  );
  return response.data;
};

export const fetchTags = async () => {
  const response = await postsApi.get("/tags");
  return response.data;
};

export const addPost = async (post) => {
  const response = await postsApi.post("/posts", post, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// # fetch method

// export const fetchPosts = async (page) => {
//   const response = await fetch(
//     `http://localhost:3000/posts?_sort=-id&${
//       page ? `_page=${page}&_per_page=5` : ""
//     }`
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch posts. Status: ${response.status}`);
//   }

//   const postData = await response.json();
//   return postData;
// };

// export const fetchTags = async () => {
//   const response = await fetch("http://localhost:3000/tags");
//   const tagsData = await response.json();
//   return tagsData;
// };

// export const addPost = async (post) => {
//   const response = await fetch("http://localhost:3000/posts", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(post),
//   });

//   return response.json();
// };
