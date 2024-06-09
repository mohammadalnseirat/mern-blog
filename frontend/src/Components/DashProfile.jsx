import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
const DashProfile = () => {
  // get current user:
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center text-3xl tracking-wide italic font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-lg overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="w-full h-full rounded-full border-8 border-[#8b8585af] object-cover"
          />
        </div>
        <TextInput
          type="text"
          defaultValue={currentUser.username}
          id="username"
          placeholder="username"
        />
        <TextInput
          type="email"
          defaultValue={currentUser.email}
          id="email"
          placeholder="Email"
        />
        <TextInput type="password" placeholder="********" id="password" />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>
      <div className="flex items-center justify-between mt-4">
        <span className="cursor-pointer text-red-500  hover:text-red-700 transition-all duration-300">Delete Account</span>
        <span className="cursor-pointer text-red-500  hover:text-red-700 transition-all duration-300">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
