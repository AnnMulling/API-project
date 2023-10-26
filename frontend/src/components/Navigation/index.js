import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import CreateSpot from '../CreateSpotForm';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (

      <div id="navContainer">
          <NavLink exact to="/" className="navHome" style={{fontWeight:'bold', fontSize: '40px'}}> <i class="fa-brands fa-airbnb"></i>annbnb</NavLink>

          {sessionUser && (
            <NavLink to="/spots/new" className="createSpotBtn">Create a New Spot</NavLink>
          )}

        {isLoaded && (
            <ProfileButton user={sessionUser} />
        )}
     </div>

  );
}

export default Navigation;
