import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateFailure,
  updateSuccess,
  updateStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  sigOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const DashProfile = () => {
  // get current user:
  const { currentUser, error, loading } = useSelector((state) => state.user);
  // ref to hidden the file field
  const filePickerRef = useRef();
  // some state for image:
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  //state for progress:
  const [imageFileProgress, setImageFileProgress] = useState(0);
  // state for error:
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  // state for data:
  const [formData, setFormData] = useState({});
  // state for update successfully:
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  // state for update error:
  const [updateUserError, setUpdateUserError] = useState(null);
  // state for uploading image:
  const [imageFileUploading, setImageFileUploading] = useState(false);
  // state to show modal:
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // useEffect to upload image:
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    console.log("image uploading....");
    setImageFileUploading(true);
    setImageFileUploadError(null);
    // create storage:
    const storage = getStorage(app);
    // get file name:
    const fileName = new Date().getTime() + imageFile.name;
    // create storage ref:
    const storageRef = ref(storage, fileName);
    // create upload task to get information when upload image:
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // how many bytes transferred
        setImageFileProgress(progress.toFixed(0));
      },
      // get error
      (error) => {
        setImageFileUploadError(
          "Could not upload image(File must be less than 2 MB)"
        );
        setImageFileProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      // get the file url:
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  // handle changes:
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle submit:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes were made.");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait while the image is uploading.");
      return;
    }
    try {
      dispatch(updateStart());
      // fetch data:
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User Profile Updated Successfully");
        setImageFileProgress(0);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  // handle delete user:
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // handle sign out user:
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/sign-out", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        dispatch(sigOutFailure(data.message));
      } else {
        dispatch(signOutSuccess(data));
      }
    } catch (error) {
      console.log(error.message);
      dispatch(sigOutFailure(error.message));
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center text-3xl tracking-wide italic font-semibold">
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={filePickerRef}
          onChange={handleImageChange}
        />
        <div
          onClick={() => filePickerRef.current.click()}
          className="relative w-32 h-32 self-center cursor-pointer shadow-lg overflow-hidden rounded-full"
        >
          {imageFileProgress && (
            <CircularProgressbar
              value={imageFileProgress || 0}
              text={`${imageFileProgress}`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full absolute top-0 w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileProgress && imageFileProgress < 100 && "opacity-50"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          defaultValue={currentUser.username}
          id="username"
          placeholder="username"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          defaultValue={currentUser.email}
          id="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <TextInput
          type="password"
          placeholder="********"
          id="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : " Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button gradientDuoTone={"purpleToPink"} outline className="w-full">
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="flex items-center justify-between mt-4">
        <span
          onClick={() => setShowModal(true)}
          className="cursor-pointer text-red-500  hover:text-red-700 transition-all duration-300"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="cursor-pointer text-red-500  hover:text-red-700 transition-all duration-300"
        >
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color={"success"} className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color={"failure"} className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color={"failure"} className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        popup
        size={"xl"}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-red-600 mb-4 mx-auto" />
            <h3 className="mb-4 text-lg text-gray-500 dark:text-gray-300 ">
              Are you sure you want to delete your account?
            </h3>
          </div>
          <div className="flex items-center justify-center gap-5">
            <Button color={"failure"} onClick={handleDeleteUser}>
              Yes,I'm Sure
            </Button>
            <Button
              color={"success"}
              onClick={() => setShowModal(false)}
              outline
            >
              No,Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
