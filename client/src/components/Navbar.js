// Navbar.js

import React from 'react';
import 'tailwindcss/tailwind.css';
//import '@headlessui/react/styles.css';
import 'daisyui/dist/full.css';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useAuth0 } from "@auth0/auth0-react";
//import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const profilePic = isAuthenticated ? user.picture : process.env.PUBLIC_URL + 'user.png';
  return (
    <nav className="navbar bg-base-100">
      <div className='flex-none'>
        <img alt="Logo" src={process.env.PUBLIC_URL + 'logo.png'} className="w-20 h-20" />
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Urban Oasis</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div>
        {isAuthenticated ? <LogoutButton/> : <LoginButton />}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Profile" src={profilePic} />
            </div>
          </div>
          <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
