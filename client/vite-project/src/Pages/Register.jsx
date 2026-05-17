import { useRef } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const userNameDom = useRef();
  const firstNameDom = useRef();
  const lastNameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const usernameValue = userNameDom.current.value;
    const firstValue = firstNameDom.current.value;
    const lastValue = lastNameDom.current.value;
    const emailValue = emailDom.current.value;
    const passValue = passwordDom.current.value;

    if (
      !usernameValue ||
      !firstValue ||
      !lastValue ||
      !emailValue ||
      !passValue
    ) {
      alert("please provide all required values");
      return;
    }
    try {
      await axios.post("/users/register", {
        username: usernameValue,
        firstname: firstValue,
        lastname: lastValue,
        email: emailValue,
        PASSWORD: passValue,
      });
      alert("user registered successfully");
      navigate("/login");
    } catch (error) {
      alert("something went wrong, try again");
      console.log(error.response);
    }
  }
  return (
    <div className="page-shell register-page">
      <section className="glass-panel register-section">
        <div className="panel-header">
          <span>Create account</span>
          <h1>Join the community</h1>
          <p>
            Register with a polished form experience built for modern
            developers.
          </p>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>User name</label>
            <input
              ref={userNameDom}
              type="text"
              className="input-field"
              placeholder="username"
            />
          </div>
          <div className="input-double">
            <div className="input-group">
              <label>First name</label>
              <input
                ref={firstNameDom}
                type="text"
                className="input-field"
                placeholder="first name"
              />
            </div>
            <div className="input-group">
              <label>Last name</label>
              <input
                ref={lastNameDom}
                type="text"
                className="input-field"
                placeholder="last name"
              />
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              ref={emailDom}
              type="email"
              className="input-field"
              placeholder="email"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              ref={passwordDom}
              type="password"
              className="input-field"
              placeholder="password"
            />
          </div>
          <button className="register-btn" type="submit">
            Register
          </button>
        </form>
        <div className="register-footer">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </section>
    </div>
  );
}

export default Register;
