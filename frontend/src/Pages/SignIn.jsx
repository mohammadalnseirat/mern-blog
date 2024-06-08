import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useSelector } from "react-redux";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(null);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get data from the input fields:
  const handleChange = (e) => {
    console.log(formData);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // submit the data in Api:
  const handleSubmit = async (e) => {
    e.preventDefault();
    // condition to check if all the fields are filled:
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please Fill All Fields!"));
    }

    try {
      // fetch the data from the api:
      // get response from the api:
      dispatch(signInStart());
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        // return setErrorMessage(data.message);
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
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
            Free Pen is a blog offering tips and resources for freelance
            writers, You can sign up with your email and password or with
            Google.
          </p>
        </div>
        {/* left side end here */}

        {/* right side start here */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Email" />
              <TextInput
                onChange={handleChange}
                type="email"
                placeholder="Enter Your Email..."
                id="email"
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                onChange={handleChange}
                type="password"
                placeholder="**********"
                id="password"
              />
            </div>
            <Button
              type="submit"
              gradientDuoTone={"purpleToPink"}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={"md"} />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <HiOutlineArrowRight className="ms-2 h-5 w-5 " />
                </>
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <p>
              Don't Have an Account?{" "}
              <Link
                to={"/sign-up"}
                className="text-blue-800 font-semibold underline underline-offset-1 hover:text-red-500 transition-all ease-in duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>
          {errorMessage && (
            <Alert
              className="mt-6 font-normal text-lg"
              color={"failure"}
              style={{ fontStyle: "italic" }}
            >
              {errorMessage}
            </Alert>
          )}
        </div>
        {/* right side end here */}
      </div>
    </div>
  );
};

export default SignIn;
