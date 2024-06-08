import React, { Children } from "react";
import { Button } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const handleClickGoogle = async () => {
    // create provider:
    const provider = new GoogleAuthProvider();
    // Add custom parameters:
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFromGoogle);
    //   send data to the store in the data base:
    const res = await fetch('/api/auth/google',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            username:resultsFromGoogle.user.displayName,
            email:resultsFromGoogle.user.email,
            googlePhotoUrl:resultsFromGoogle.user.photoURL
        })
       
    })
     // convert to json:
     const data = await res.json()
     if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
     }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button outline gradientDuoTone={"redToYellow"} onClick={handleClickGoogle}>
      <FcGoogle className="w-6 h-6 mr-3" />
      <span className="mt-[4px]">Continue With Google</span>
    </Button>
  );
};

export default OAuth;
