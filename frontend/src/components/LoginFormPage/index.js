import React , { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import './LoginForm.css'


function LoginFormPage () {
    console.log('login form rendered')


    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    console.log('current state', sessionUser)
    const [ credential, setCredential ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errors, setErrors ] = useState({});

    // if (!sessionUser) return <Redirect to='/'/>

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password })).catch(
            async (res) => {
              const data = await res.json();
              if (data && data.errors) setErrors(data.errors);
            }
          );
        };

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <lable>
                    Username or Email
                    <input
                    type="text"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    />
                </lable>
                <label>
                    Password
                    <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {errors.credential && <p className='errors'>{errors.credential}</p>}
                <button type="submit" disabled={Object.keys(errors).length > 0}>Login</button>
            </form>
        </>
    );

}



export default LoginFormPage;
