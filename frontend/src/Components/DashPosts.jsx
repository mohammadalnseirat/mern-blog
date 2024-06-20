import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashPosts = () => {
  // get currentUser
  const { currentUser } = useSelector((state) => state.user);
  // state for save  posts
  const [userPosts, setUserPosts] = useState([]);
  console.log(userPosts);
  // fetch the data from api using useEffect:
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // create response:
        const res = await fetch(
          `/api/post/get-posts?userId=${currentUser._id}`
        );
        // convert data:
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAmin) {
      fetchPosts();
    }
  }, [currentUser._id]);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAmin ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>updated At</Table.HeadCell>
            <Table.HeadCell>Post image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>
              <span>Edit</span>
            </Table.HeadCell>
          </Table.Head>
          {userPosts.map((post) => (
            <Table.Body className="divide-y" key={post._id}>
              <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-600">
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-400"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-red-600 hover:underline">
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/update-post/${post._id}`}
                    className="text-teal-600 font-medium hover:underline"
                  >
                    <span>Edit</span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p className="text-5xl mt-10 text-red-500 italic">
          You have no posts yet!
        </p>
      )}
    </div>
  );
};

export default DashPosts;
