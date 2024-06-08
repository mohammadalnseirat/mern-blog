import React from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useSelector } from "react-redux";

const NavBar = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-md sm:text-xl font-semibold dark:text-white "
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg text-white">
          FreePen
        </span>
        Blog
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10  lg:hidden" color={"gray"} pill>
        <AiOutlineSearch className="text-xl" />
      </Button>
      <div className="flex items-center gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color={"gray"} pill>
          <FaMoon />
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user-profile"
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <sapn className="block text-sm font-medium truncate">
                {currentUser.email}
              </sapn>
            </Dropdown.Header>

            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>

            <Dropdown.Divider />
            <Dropdown.Item>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button
              gradientDuoTone={"purpleToPink"}
              className="rounded"
              outline
            >
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"} className="text-lg">
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"} className="text-lg">
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"} className="text-lg">
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
