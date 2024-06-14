import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sigOutFailure,signOutSuccess } from "../redux/user/userSlice";

const DashSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

    // handle sign out user:
    const handleSignOut=async ()=>{
      try {
        const res= await fetch ('/api/user/sign-out',{
          method:'POST',
        })
        const data=await res.json()
        if(!res.ok){
          console.log(data.message)
          dispatch(sigOutFailure(data.message))
        }else{
          dispatch(signOutSuccess(data))
        }
      } catch (error) {
        console.log(error.message)
        dispatch(sigOutFailure(error.message))
      }
    }
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={FaUser}
              label="User"
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item className='cursor-pointer' icon={FaArrowRight} onClick={handleSignOut}>Sign Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
