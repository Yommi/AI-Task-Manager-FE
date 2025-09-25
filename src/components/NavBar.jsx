import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-purple-500 px-8 py-5 flex flex-row justify-between font-semibold text-white">
      <div className="flex flex-row gap-x-14">
        <Link to="/dashboard" className={tailwind.navigation}>
          AI Dashboard
        </Link>
        <Link to="/tasks" className={tailwind.navigation}>
          Tasks
        </Link>
      </div>
      <h1
        className={tailwind.navigation}
        style={{ textDecoration: "underline" }}
      >
        Sign out
      </h1>
    </nav>
  );
};

const tailwind = {
  navigation: "hover:cursor-pointer hover:scale-103",
};

export default NavBar;
