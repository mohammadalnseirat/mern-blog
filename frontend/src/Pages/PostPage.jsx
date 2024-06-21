import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const PostPage = () => {
  const { postSlug } = useParams();
  // stete for loading:
  const [loading, setLoading] = useState(true);
  // state for error:
  const [error, setError] = useState(false);
  // state for post data:
  const [postData, setPostData] = useState(null);
  // useEffect to fetch data depending on the post slug:
  useEffect(() => {
    // fetch post data:
    const fetchPost = async () => {
      try {
        setLoading(true);
        // create response:
        const res = await fetch(`/api/post/get-posts?slug=${postSlug}`);
        // convert data:
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPostData(data.posts[0]);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);
  // spinner:
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" color="warning" />
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl lg:text-4xl mt-10 p-3 text-center max-w-2xl mx-auto font-serif">
        {postData && postData.title}
      </h1>
      <Link
        to={`/search?category=${postData && postData.category}`}
        className="self-center"
      >
        <Button color={"purple"} pill size={"md"}>
          {postData && postData.category}
        </Button>
      </Link>
      <img
        src={postData && postData.image}
        alt={postData && postData.title}
        className="mt-10 p-3 mx-h-[600px] w-full object-cover"
      />
      <div className="flex items-center justify-between p-3 max-w-2xl w-full mx-auto text-xs border-b border-slate-700">
        <span>
          {postData && new Date(postData.createdAt).toLocaleDateString()}
        </span>
        <span className="italic">
          {postData && (postData.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: postData && postData.content }}
        className="p-3 max-w-2xl mx-auto w-full post-content"
      ></div>
    </main>
  );
};

export default PostPage;
