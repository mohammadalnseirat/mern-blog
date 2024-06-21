import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sigOutFailure, signOutSuccess } from "../redux/user/userSlice";
import { IoDocumentsSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { FaUsersCog } from "react-icons/fa";

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-4">
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={FaUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=posts"}>
              <Sidebar.Item
                active={tab === "posts"}
                icon={IoDocumentsSharp}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={`/dashboard?tab=users`}>
              <Sidebar.Item active={tab === "users"} icon={FaUsersCog} as="div">
                Users
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            className="cursor-pointer"
            icon={FaArrowRight}
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
