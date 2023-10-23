import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <div id="navContainer">
          <NavLink exact to="/" style={{fontWeight:'bold', fontSize: '40px'}}> <i class="fa-brands fa-airbnb"></i> annbnb</NavLink>
        {isLoaded && (
          <div>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
