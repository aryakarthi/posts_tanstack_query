import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { addPost, fetchPosts, fetchTags } from "../api/postsApi";

const PostList = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const {
    data: postsData,
    isLoading,
    isError,
    error,
    status,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 60 * 5,
    // gcTime: 0,
    // refetchInterval: 1000 * 60,
  });

  console.log(postsData, isLoading, isError, error, status);

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: Infinity,
  });

  console.log(tagsData);

  const {
    mutate,
    isPending,
    isError: isAddError,
    error: addError,
    reset,
  } = useMutation({
    mutationFn: addPost,
    onMutate: () => {
      return { id: 1 };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );

    console.log({ id: postsData.length + 1, title, tags });

    if (!title || !tags) return;

    mutate({ id: postsData?.data.length + 1, title, tags });

    e.target.reset();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your post.."
          className="postbox"
          name="title"
        />
        <div className="tags">
          {tagsData?.map((tag, index) => {
            return (
              <div key={index}>
                <input name={tag} id={tag} type="checkbox" />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>
        <button disabled={isPending}>
          {isPending ? "Posting..." : "Post"}
        </button>
      </form>
      {isLoading && isPending && <p>Loading...</p>}
      {isError && <p>{error?.message}</p>}
      {isAddError && (
        <div className="show-error">
          <span>Unable to post!</span>
          <button onClick={() => reset()}>Reset</button>
        </div>
      )}
      <div className="pages">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
          disabled={!postsData?.prev}
        >
          prev
        </button>
        <span>{page}</span>
        <button
          onClick={() => setPage((curPage) => curPage + 1)}
          disabled={!postsData?.next}
        >
          next
        </button>
      </div>
      {postsData?.data.map((post) => {
        return (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            {post?.tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
