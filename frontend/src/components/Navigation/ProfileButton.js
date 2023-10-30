import React, { useState, useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import ManageSpot from "../ManageSpot/ManangeSpot";


function ProfileButton({ user }) {
  const history = useHistory();
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
    history.push("/")
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  const manageSpot = () => {
    history.push("/spots/current");
    closeMenu();
  }

  return (
    <>
      <div onClick={openMenu} id="profileBtn">
        <i class="fa-solid fa-bars"></i>
        <i className="fas fa-user-circle" />
      </div>

      <ul className={`${ulClassName}`}  ref={ulRef}>
        {user ? (
          <>

            <p>Hello {user.username}</p>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button id="manage-spot" onClick={manageSpot}>Manage Spots</button>
            </li>
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

          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
