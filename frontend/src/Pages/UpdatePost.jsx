import React, { useEffect, useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { response } from "express";

const UpdatePost = () => {
  // get current user:
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // state to save image:
  const [file, setFile] = useState(null);
  // state for error uploading image:
  const [imageUploadError, setImageUploadError] = useState(null);
  // state for upload image progress:
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  // form data to store all data from input:
  const [formData, setFormData] = useState({});
  // state for puplish error:
  const [puplishError, setPuplishError] = useState(null);
  const { postId } = useParams();

  //   useEffect to get the post:
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/get-posts?postIs=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPuplishError(data.message);
          console.log(data.message);
          return;
        }
        if (res.ok) {
          setFormData(data.posts[0]);
          setPuplishError(null);
        }
      };
      fetchPost();
    } catch (error) {
      setPuplishError(error.message);
      console.log(error.message);
    }
  }, [postId]);

  // handle upload image:
  const handleUploadImage = async () => {
    try {
      // check if there is no file:
      if (!file) {
        setImageUploadError("Please Select an image.");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed.");
          setImageUploadProgress(null);
        },
        // get download url:
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadUrl });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  // handle Submit Update Data:
  const handleSubmitUpdateData = async (e) => {
    // prevent Dafault :
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/update-post/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      // convert the response:
      const data = await res.json();
      if (!res.ok) {
        setPuplishError(data.message);
        return;
      }
      if (res.ok) {
        setPuplishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPuplishError("Something went wrong. Please try again");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen ">
      <h1 className="text-center text-3xl font-semibold my-7">
        {" "}
        Update a Post
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmitUpdateData}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Title"
            id="title"
            className="flex-1"
            required
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value={"uncategorized"}>Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React Js</option>
            <option value="nodejs">Node Js</option>
          </Select>
        </div>
        <div className="flex items-center gap-4 justify-between border-4 border-teal-600 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone={"purpleToBlue"}
            size={"sm"}
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert className="font-semibold" color={"failure"}>
            {imageUploadError}
          </Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload-image-post"
            className="w-full h-[600px] object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content}
        />
        <Button
          type="submit"
          className="mb-5"
          gradientDuoTone={"greenToBlue"}
          outline
        >
          Update
        </Button>
        {puplishError && (
          <Alert className="mt-1 font-semibold" color={"failure"}>
            {puplishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdatePost;
