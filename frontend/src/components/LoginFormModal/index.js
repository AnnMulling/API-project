import React, { useState, useEffect, useDebugValue } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  console.log('loginform ')
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {

    if (credential.length >= 4 || password.length >= 4) setDisabled(false);
    if (Object.keys(errors).length > 0) setDisabled(true)

  }, [credential, password, errors])

  const handleSubmit = (e) => {

    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();

        if (data && data.errors) {
          setErrors(data.errors);

          console.log(errors)
        }

      });
  };

  return (
    <>
      <div id="loginContainer">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit} className='login'>
          {/* <label> Username or Email */}
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username of Email"
            className="inputLogin"
            required
          />
          {/* </label> */}
          {/* <label>Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="inputLogin"
            required
          />
          {/* </label> */}
          {errors.credential && (
            <p className="errors">{errors.credential}</p>
          )}
          <button type="submit" disabled={disabled} id='loginBtn' >Log In</button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
