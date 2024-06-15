import React from "react";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen ">
      <h1 className="text-center text-3xl font-semibold my-7">
        {" "}
        Create a Post
      </h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Title"
            id="title"
            className="flex-1"
            required
            type="text"
          />
          <Select>
            <option value={"uncategorized"}>Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React Js</option>
            <option value="nodejs">Node Js</option>
          </Select>
        </div>
        <div className="flex items-center gap-4 justify-between border-4 border-teal-600 border-dotted p-3">
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone={"purpleToBlue"}
            size={"sm"}
            outline
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="write something..."
          className="h-72 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Puplish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
