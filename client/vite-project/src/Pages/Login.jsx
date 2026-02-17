import React from 'react'
import { useRef } from 'react';
import axios from "../axiosConfig";
import {Link, useNavigate } from "react-router-dom";



  
 
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
const {data}= await axios.post("/users/login", {
        email: emailValue,
        PASSWORD: passValue,
      });
      alert("login successfully");

      localStorage.setItem("token", data.token);



      navigate("/");
      console.log(data)
    } catch (error) {
      alert(error?.response?.data?.msg);
      console.log(error.response);
    }
  }


  
  return (
    <section>
      {" "}
      <form onSubmit={handleSubmit}>
          
        <div>
          <span>email :---</span>
          <input ref={emailDom} type="email" placeholder="email" />
        </div>
        <br />
        <div>
          <span>password :---</span>
          <input ref={passwordDom} type="password" placeholder="password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to={"/register"}>register</Link>
    </section>
  );
}

export default Login
