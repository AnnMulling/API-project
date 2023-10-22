import React, { useState, useEffect, useRef } from "react";
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const demoLogin = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({
      credential: 'user6',
      password: 'password6'
    })).then(closeMenu)
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div onClick={openMenu} id="profileBtn">
        <i class="fa-solid fa-bars"></i>
        <i className="fas fa-user-circle" />
      </div>

      <ul className={`profileList ${ulClassName}`}  ref={ulRef}>
        {user ? (
          <>

            <p>Hello   {user.username}</p>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout} id="logoutBtn">Log Out</button>
            </li>

          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            <div onClick={demoLogin}>DemoUser</div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
