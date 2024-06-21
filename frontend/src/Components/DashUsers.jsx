import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { IoCheckmarkDone } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";

const DashUsers = () => {
  // get currentUser
  const { currentUser } = useSelector((state) => state.user);
  // state for save  posts
  const [users, setUsers] = useState([]);
  // state for show more button:
  const [showMore, setShowMore] = useState(true);
  // state to show models:
  const [showModal, setShowModal] = useState(false);
  // state to save post id:
  const [userIdToDelete, setUserIdToDelete] = useState("");
  // fetch the data from api using useEffect to render this component when current user change:
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // create response:
        const res = await fetch("/api/user/get-users");
        // convert data:
        const data = await res.json();
        if (res.ok) {
          setUsers(data.posts);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  // handle Show More Results:
  const handleShowMoreResults = async () => {
    const startIndex = users.length;
    try {
      // create response:
      const res = await fetch(`/api/user/get-users?startIndex=${startIndex}`);
      // conert response:
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // handle Delete User:
  const handleDeleteUser = async () => {};

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>created At</Table.HeadCell>
              <Table.HeadCell>user image</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>isAdmin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-600">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-20 h-20 object-cover rounded-full bg-gray-500 "
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAmin ? (
                      <IoCheckmarkDone className="text-green-600" />
                    ) : (
                      <FaTimes className="text-red-600" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-600 hover:underline"
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
              Are you sure you want to delete this User?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
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

export default DashUsers;
