import React from "react";
import { useRef } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const emailDom = useRef();
  const passwordDom = useRef();
  async function handleSubmit(e) {
    e.preventDefault();

    const emailValue = emailDom.current.value;
    const passValue = passwordDom.current.value;

    if (!emailValue || !passValue) {
      alert("please provide all required values");
      return;
    }
    try {
      const { data } = await axios.post("/users/login", {
        email: emailValue,
        PASSWORD: passValue,
      });
      alert("login successfully");

      localStorage.setItem("token", data.token);

      navigate("/");
      console.log(data);
    } catch (error) {
      alert(error?.response?.data?.msg);
      console.log(error.response);
    }
  }

  return (
    <div className="page-shell login-page">
      <section className="glass-panel login-section">
        <div className="panel-header">
          <span>Sign in</span>
          <h1>Welcome Back</h1>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              ref={emailDom}
              type="email"
              className="input-field"
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              ref={passwordDom}
              type="password"
              className="input-field"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <div className="register-link">
          <Link to="/register">Don't have an account? Register</Link>
        </div>
      </section>
    </div>
  );
}

export default Login;
