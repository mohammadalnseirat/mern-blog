import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

const SignUp = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side start here */}
        <div className="flex-1">
          <Link to={"/"} className="text-4xl font-bold dark:text-white ">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg text-white">
              FreePen
            </span>
            Blog
          </Link>
          <p className="text-md mt-5 ">
            Free Pen is a blog offering tips and resources for freelance writers, You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/* left side end here */}

        {/* right side start here */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your UserName"/>
              <TextInput type="text" placeholder="Enter Your UserName..." id="username"/>
            </div>

            <div>
              <Label value="Your Email"/>
              <TextInput type="email" placeholder="Enter Your Email..." id="email"/>
            </div>
            <div>
              <Label value="Your Password"/>
              <TextInput type="password" placeholder="Enter Your Password..." id="password"/>
            </div>
            <Button type="submit"  gradientDuoTone={'purpleToPink'}>
            Sign Up <HiOutlineArrowRight className="ms-2 mt-[2px] h-4 w-4" /> 
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <p>
              Already have an account? <Link to={"/sign-in"} className="text-blue-800 font-semibold underline underline-offset-1 hover:text-red-500 transition-all ease-in duration-300">Sign In</Link>
            </p>
          </div>
        </div>
        {/* right side end here */}
      </div>
    </div>
  );
};

export default SignUp;
