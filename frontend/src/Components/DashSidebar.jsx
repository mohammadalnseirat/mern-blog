import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { Sidebar } from "flowbite-react";
import { useLocation } from "react-router-dom";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    console.log(tabFromUrl);
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            active={tab === "profile"}
            icon={FaUser}
            label="User"
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
          <Sidebar.Item icon={FaArrowRight}>Sign Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
