import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  console.log('signup form rendered')
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [className, setClassName ] = useState("disabled")
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

 useEffect(() => {
    // const error = {}
    if (email && username && firstName && lastName && password && confirmPassword !== ''){
       setDisabled(false);
       setClassName("signupBtn");
    }

    if (Object.keys(errors).length > 0) {
        setDisabled(true)
        setClassName("disabled")
     }

    //  if (!email.length)


}, [email, username, firstName, lastName, password, confirmPassword, errors])



  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} id="signup">
        <label className="labelSignup">
          Email
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="inputSignup"
          required
        />

        {errors.email && <p className="errors">{errors.email}</p>}
        <label className="labelSignup">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="inputSignup"
          required
        />

        {errors.username && <p className="errors">{errors.username}</p>}
        <label className="labelSignup">
          First Name
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="inputSignup"
          required
        />

        {errors.firstName && <p className="errors">{errors.firstName}</p>}
        <label className="labelSignup">
          Last Name
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="inputSignup"
          required
        />

        {errors.lastName && <p className="errors">{errors.lastName}</p>}
        <label className="labelSignup">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="inputSignup"
          required
        />

        {errors.password && <p className="errors">{errors.password}</p>}
        <label className="labelSignup">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="inputSignup"
          required
        />

        {errors.confirmPassword && (
          <p className="errors">{errors.confirmPassword}</p>
        )}
        <button type="submit" className={`${className} signupBtn`} disabled={disabled}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
