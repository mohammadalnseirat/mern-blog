import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashPosts = () => {
  // get currentUser
  const { currentUser } = useSelector((state) => state.user);
  // state for save  posts
  const [userPosts, setUserPosts] = useState([]);
  // state for show more button:
  const [showMore, setShowMore] = useState(true);
  // state to show models:
  const [showModal, setShowModal] = useState(false);
  // state to save post id:
  const [postIdToDelete, setPostIdToDelete] = useState("");
  console.log(userPosts);
  // fetch the data from api using useEffect to render this component when current user change:
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
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  // handle Show More Results:
  const handleShowMoreResults = async () => {
    const startIndex = userPosts.length;
    try {
      // create response:
      const res = await fetch(
        `/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      // conert response:
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  };
  // handle Delete Post:
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      // create response:
      const res = await fetch(
        `/api/post/delete-post/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      // convert data response:
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAmin && userPosts.length > 0 ? (
        <>
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
                    <span
                      className="font-medium text-red-600 hover:underline"
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
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
          {showMore && (
            <button
              className="w-full text-teal-600 self-center text-sm py-8"
              onClick={handleShowMoreResults}
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p className="text-5xl mt-10 text-red-500 italic">
          You have no posts yet!
        </p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="xl"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPosts;
